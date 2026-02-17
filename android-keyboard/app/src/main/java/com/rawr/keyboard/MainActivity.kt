package com.rawr.keyboard

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // No layout for now, just a placeholder activity to enter settings
        setTitle("RAWR Settings")
    }
}
