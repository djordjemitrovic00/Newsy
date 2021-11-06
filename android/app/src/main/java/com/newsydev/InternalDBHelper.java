package com.newsydev;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.facebook.react.bridge.ReactMethod;

public class InternalDBHelper extends SQLiteOpenHelper {


    InternalDBHelper(Context context) {
        super(context, "MainDB", null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE MYID (" +
                "ID TEXT PRIMARY KEY)");


    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }




}
