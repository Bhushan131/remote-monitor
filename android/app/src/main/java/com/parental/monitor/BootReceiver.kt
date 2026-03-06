package com.parental.monitor

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            val prefs = context.getSharedPreferences("setup", Context.MODE_PRIVATE)
            if (prefs.getBoolean("completed", false)) {
                context.startForegroundService(Intent(context, MonitoringService::class.java))
            }
        }
    }
}
