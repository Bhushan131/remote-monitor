package com.parental.monitor;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        registerPlugin(ScreenCapturePlugin.class);
    }
}
