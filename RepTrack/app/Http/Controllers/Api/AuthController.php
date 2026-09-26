<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid request'], 422);
        }

        $user = User::where('email', $request->input('email'))->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        // One active token per login; swap for ->createToken(...) without
        // deleting previous tokens if you want multi-device sessions.
        $user->tokens()->delete();
        $token = $user->createToken('reptrack-client')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user_id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
        ]);
    }
}
