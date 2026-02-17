package com.rawr.keyboard

import android.inputmethodservice.InputMethodService
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.view.KeyEvent
import android.view.inputmethod.InputConnection

class RawrInputService : InputMethodService() {

    override fun onCreateInputView(): View {
        val view = layoutInflater.inflate(R.layout.keyboard_view, null)
        
        val btnRawr = view.findViewById<Button>(R.id.btn_rawr)
        btnRawr.setOnClickListener {
            // Commit the § symbol
            currentInputConnection.commitText("§", 1)
            
            // TODO: Trigger interaction with Backend API here
            // This is where we will capture context and send to http://<HOST>:8000/api/store
        }
        
        return view
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        // Handle physical keyboard events if needed
        return super.onKeyDown(keyCode, event)
    }
}
