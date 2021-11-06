package com.newsydev;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;

public class NewsSingleton {
    private static NewsSingleton instance;
    private static RequestQueue requestQueue;
    private static Context ctx;


    NewsSingleton(Context context) {
        ctx = context;
        requestQueue = getRequestQueue();

    }
    private static RequestQueue getRequestQueue() {
        if (requestQueue == null) {
            Volley.newRequestQueue(ctx.getApplicationContext());
        }
        return requestQueue;
    }
    public static synchronized NewsSingleton getInstance(Context context) {
        if (instance == null) {
            instance = new NewsSingleton(context);
        }
        return instance;
    }
    public <T> void addToRequestQueue(Request<T> req) {
        getRequestQueue().add(req);
    }
}
