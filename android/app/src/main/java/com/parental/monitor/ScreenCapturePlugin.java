package com.parental.monitor;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.DisplayMetrics;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.ActivityCallback;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;

@CapacitorPlugin(name = "ScreenCapture")
public class ScreenCapturePlugin extends Plugin {
    private static final int REQUEST_CODE = 1000;
    private MediaProjectionManager projectionManager;
    private MediaProjection mediaProjection;
    private VirtualDisplay virtualDisplay;
    private ImageReader imageReader;
    private Handler handler;

    @PluginMethod
    public void startCapture(PluginCall call) {
        projectionManager = (MediaProjectionManager) getContext().getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        Intent intent = projectionManager.createScreenCaptureIntent();
        startActivityForResult(call, intent, "handleCaptureResult");
    }

    @ActivityCallback
    private void handleCaptureResult(PluginCall call, android.content.pm.ActivityResult result) {
        if (result.getResultCode() == Activity.RESULT_OK) {
            mediaProjection = projectionManager.getMediaProjection(result.getResultCode(), result.getData());
            setupVirtualDisplay();
            call.resolve();
        } else {
            call.reject("Permission denied");
        }
    }

    private void setupVirtualDisplay() {
        DisplayMetrics metrics = getContext().getResources().getDisplayMetrics();
        int width = metrics.widthPixels / 2;
        int height = metrics.heightPixels / 2;
        int density = metrics.densityDpi;

        imageReader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2);
        virtualDisplay = mediaProjection.createVirtualDisplay("ScreenCapture",
                width, height, density,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                imageReader.getSurface(), null, null);

        handler = new Handler(Looper.getMainLooper());
    }

    @PluginMethod
    public void captureFrame(PluginCall call) {
        if (imageReader == null) {
            call.reject("Capture not started");
            return;
        }

        handler.post(() -> {
            Image image = imageReader.acquireLatestImage();
            if (image != null) {
                Image.Plane[] planes = image.getPlanes();
                ByteBuffer buffer = planes[0].getBuffer();
                int pixelStride = planes[0].getPixelStride();
                int rowStride = planes[0].getRowStride();
                int rowPadding = rowStride - pixelStride * image.getWidth();

                Bitmap bitmap = Bitmap.createBitmap(
                        image.getWidth() + rowPadding / pixelStride,
                        image.getHeight(),
                        Bitmap.Config.ARGB_8888);
                bitmap.copyPixelsFromBuffer(buffer);

                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 50, outputStream);
                String base64 = Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP);

                JSObject ret = new JSObject();
                ret.put("image", "data:image/jpeg;base64," + base64);
                call.resolve(ret);

                image.close();
                bitmap.recycle();
            } else {
                call.reject("No frame available");
            }
        });
    }

    @PluginMethod
    public void stopCapture(PluginCall call) {
        if (virtualDisplay != null) virtualDisplay.release();
        if (imageReader != null) imageReader.close();
        if (mediaProjection != null) mediaProjection.stop();
        call.resolve();
    }
}
