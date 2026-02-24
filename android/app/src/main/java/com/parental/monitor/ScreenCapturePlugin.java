package com.parental.monitor;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.ActivityCallback;

@CapacitorPlugin(name = "ScreenCapture")
public class ScreenCapturePlugin extends Plugin {
    private static final int REQUEST_CODE = 1000;
    private MediaProjectionManager projectionManager;

    @PluginMethod
    public void startCapture(PluginCall call) {
        projectionManager = (MediaProjectionManager) getContext().getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        Intent intent = projectionManager.createScreenCaptureIntent();
        startActivityForResult(call, intent, "handleCaptureResult");
    }

    @ActivityCallback
    private void handleCaptureResult(PluginCall call, android.content.pm.ActivityResult result) {
        if (result.getResultCode() == Activity.RESULT_OK) {
            Intent serviceIntent = new Intent(getContext(), ScreenCaptureService.class);
            serviceIntent.putExtra("projection", true);
            serviceIntent.putExtra("resultCode", result.getResultCode());
            serviceIntent.putExtra("data", result.getData());
            getContext().startForegroundService(serviceIntent);
            call.resolve();
        } else {
            call.reject("Permission denied");
        }
    }

    @PluginMethod
    public void captureFrame(PluginCall call) {
        String frame = ScreenCaptureService.latestFrame;
        if (frame != null && !frame.isEmpty()) {
            JSObject ret = new JSObject();
            ret.put("image", frame);
            call.resolve(ret);
        } else {
            call.reject("No frame available");
        }
    }

    @PluginMethod
    public void stopCapture(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), ScreenCaptureService.class);
        getContext().stopService(serviceIntent);
        call.resolve();
    }
}
