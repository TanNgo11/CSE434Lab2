package com.lab2

import android.app.Activity
import android.content.Context
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BrightnessModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BrightnessModule"
    }

    @ReactMethod
    fun setBrightness(brightness: Float) {
        // Ensure brightness is between 0 and 1
        val clampedBrightness = brightness.coerceIn(0f, 1f)
        val activity: Activity? = currentActivity

        activity?.runOnUiThread {
            val layoutParams = activity.window.attributes
            layoutParams.screenBrightness = clampedBrightness
            activity.window.attributes = layoutParams
        }
    }
}
