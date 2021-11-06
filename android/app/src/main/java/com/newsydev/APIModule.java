package com.newsydev;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

public class APIModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext ctx;
    public APIModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ctx = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "APIModule";
    }

    @ReactMethod
    public void getNews(Promise promise) {
        WritableArray arej = Arguments.createArray();
        RequestQueue rq = Volley.newRequestQueue(ctx.getApplicationContext());
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.GET, "https://www.metaweather.com/api/location/search/?query=Phoenix", null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {


                        promise.resolve(response);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                promise.reject(error);
            }
        });
        rq.add(request);
    }
}
