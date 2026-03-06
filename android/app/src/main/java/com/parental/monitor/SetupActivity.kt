package com.parental.monitor

import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class SetupActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Check if already setup
        val prefs = getSharedPreferences("setup", MODE_PRIVATE)
        if (prefs.getBoolean("completed", false)) {
            // Already setup, hide and start service
            hideAppIcon()
            startMonitoringService()
            finish()
            return
        }
        
        // Show minimal setup UI
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(50, 100, 50, 50)
        }
        
        val title = TextView(this).apply {
            text = "Child Safety Setup"
            textSize = 24f
            setPadding(0, 0, 0, 50)
        }
        layout.addView(title)
        
        val desc = TextView(this).apply {
            text = "This app will monitor device usage for safety.\n\nParent code required to uninstall."
            textSize = 16f
            setPadding(0, 0, 0, 50)
        }
        layout.addView(desc)
        
        val button = Button(this).apply {
            text = "Activate Protection"
            setOnClickListener {
                completeSetup()
            }
        }
        layout.addView(button)
        
        setContentView(layout)
    }
    
    private fun completeSetup() {
        // Mark setup as complete
        getSharedPreferences("setup", MODE_PRIVATE).edit()
            .putBoolean("completed", true)
            .apply()
        
        // Hide app icon
        hideAppIcon()
        
        // Start monitoring service
        startMonitoringService()
        
        Toast.makeText(this, "Protection activated", Toast.LENGTH_SHORT).show()
        finish()
    }
    
    private fun hideAppIcon() {
        try {
            val componentName = ComponentName(this, SetupActivity::class.java)
            packageManager.setComponentEnabledSetting(
                componentName,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    
    private fun startMonitoringService() {
        try {
            val intent = Intent(this, MonitoringService::class.java)
            startForegroundService(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
