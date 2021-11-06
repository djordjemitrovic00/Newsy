package com.newsydev;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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

public class InternalDBModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext ctx;
    public InternalDBModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ctx = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "InternalDBModule";
    }

    @ReactMethod
    public void AddId(String id) {
        ContentValues cv = new ContentValues();
        cv.put("ID", id);
        SQLiteOpenHelper dbh = new InternalDBHelper(ctx.getApplicationContext());
        SQLiteDatabase db = dbh.getWritableDatabase();
        db.insert("MYID", null, cv);
        db.close();
    }

    @ReactMethod
    public void getId(Callback cb) {
        SQLiteOpenHelper dbh = new InternalDBHelper(ctx.getApplicationContext());
        SQLiteDatabase db = dbh.getReadableDatabase();
        String response = "pocetak";
        Cursor cursor = db.query("MYID", new String[]{"ID"}, null, null, null, null, null);
        if (cursor.moveToFirst()) {
            response = cursor.getString(cursor.getColumnIndex("ID"));
        } else {
            response = "No answer";
        }
        cursor.close();
        db.close();
        cb.invoke(response);
    }

    public String getId() {
        SQLiteOpenHelper dbh = new InternalDBHelper(ctx.getApplicationContext());
        SQLiteDatabase db = dbh.getReadableDatabase();
        String response = "pocetak";
        Cursor cursor = db.query("MYID", new String[]{"ID"}, null, null, null, null, null);
        if (cursor.moveToFirst()) {
            response = cursor.getString(cursor.getColumnIndex("ID"));
        } else {
            response = "No answer";
        }
        cursor.close();
        db.close();
        return response;
    }

    @ReactMethod
    public void disconnect() {
        SQLiteOpenHelper dbh = new InternalDBHelper(ctx.getApplicationContext());
        SQLiteDatabase db = dbh.getWritableDatabase();
        String currentId = getId();
        db.delete("MYID", null, null);
        db.close();
    }

    @ReactMethod
    public void SeeDB(Callback cb) {
        SQLiteOpenHelper dbh = new InternalDBHelper(ctx.getApplicationContext());
        SQLiteDatabase db = dbh.getReadableDatabase();
        String response = "See list: \n";
        Cursor cursor = db.query("MYID", new String[]{"ID"}, null, null, null, null, null);
        if (cursor.moveToFirst()) {
            response = response.concat(cursor.getString(cursor.getColumnIndex("ID")).toString() + "\n");
            while (cursor.moveToNext()) {
                response = response.concat(cursor.getString(cursor.getColumnIndex("ID")).toString() + "\n");
            }
        }
        cursor.close();
        cb.invoke(response);

    }
}
