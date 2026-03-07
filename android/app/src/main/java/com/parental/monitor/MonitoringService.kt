package com.parental.monitor

import android.app.*
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.location.LocationManager
import android.os.IBinder
import android.util.Log
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class MonitoringService : Service() {
    
    private val executor = Executors.newSingleThreadScheduledExecutor()
    private val TAG = "MonitorService"
    
    override fun onCreate() {
        super.onCreate()
        try {
            startForeground(1, createNotification())
            startMonitoring()
        } catch (e: Exception) {
            Log.e(TAG, "Error in onCreate: ${e.message}")
        }
    }
    
    private fun createNotification(): Notification {
        val channel = NotificationChannel("monitor", "Protection", NotificationManager.IMPORTANCE_LOW)
        (getSystemService(NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)
        
        return Notification.Builder(this, "monitor")
            .setContentTitle("Device Protection")
            .setContentText("Active")
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .build()
    }
    
    private fun startMonitoring() {
        // Collect data every 5 minutes
        executor.scheduleAtFixedRate({
            try {
                collectAndSendData()
            } catch (e: Exception) {
                Log.e(TAG, "Error: ${e.message}")
            }
        }, 0, 5, TimeUnit.MINUTES)
    }
    
    private fun collectAndSendData() {
        try {
            val data = JSONObject().apply {
                put("deviceId", getUniqueDeviceId())
                put("timestamp", System.currentTimeMillis())
                put("appUsage", getAppUsage())
                put("location", getLocation())
                put("battery", getBatteryLevel())
            }
            
            sendToServer(data)
        } catch (e: Exception) {
            Log.e(TAG, "Error collecting data: ${e.message}")
        }
    }
    
    private fun getUniqueDeviceId(): String {
        return try {
            getSharedPreferences("device", MODE_PRIVATE)
                .getString("id", android.provider.Settings.Secure.getString(
                    contentResolver, android.provider.Settings.Secure.ANDROID_ID
                )) ?: "unknown"
        } catch (e: Exception) {
            "unknown"
        }
    }
    
    private fun getAppUsage(): String {
        return try {
            val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - (5 * 60 * 1000)
            
            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY, startTime, endTime
            )
            
            stats?.filter { it.totalTimeInForeground > 0 }
                ?.joinToString(",") { "${it.packageName}:${it.totalTimeInForeground}" } ?: ""
        } catch (e: Exception) {
            ""
        }
    }
    
    private fun getLocation(): String {
        return try {
            val locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
            val location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
            if (location != null) {
                "${location.latitude},${location.longitude}"
            } else ""
        } catch (e: Exception) {
            ""
        }
    }
    
    private fun getBatteryLevel(): Int {
        return try {
            val batteryManager = getSystemService(Context.BATTERY_SERVICE) as android.os.BatteryManager
            batteryManager.getIntProperty(android.os.BatteryManager.BATTERY_PROPERTY_CAPACITY)
        } catch (e: Exception) {
            0
        }
    }
    
    private fun sendToServer(data: JSONObject) {
        Thread {
            try {
                val url = URL("http://localhost:3000/api/report")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.doOutput = true
                conn.connectTimeout = 5000
                conn.readTimeout = 5000
                
                conn.outputStream.use { it.write(data.toString().toByteArray()) }
                
                val response = conn.responseCode
                Log.d(TAG, "Sent data, response: $response")
            } catch (e: Exception) {
                Log.e(TAG, "Send failed: ${e.message}")
            }
        }.start()
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
    
    override fun onDestroy() {
        super.onDestroy()
        executor.shutdown()
    }
}
