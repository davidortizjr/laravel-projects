<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Todo App</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])

</head>

<body>
    @auth
        <x-header />

        <h1 class="text-3xl font-bold text-center justify-center w-full">
            Hello world! Welcome to my to-do app!
        </h1>

        <div class="flex mt-8">
            <div class="w-1/2 mt-5 p-8">
                <h1 class="text-2xl font-bold text-center justify-center mb-8">
                    This is the checkbox of to do lists
                </h1>
                @foreach ($items as $item)

                    @if ($item->priority === 'high' && !$item->completed)
                        <div class="flex items-center justify-center mb-2 bg-red-200 p-2 rounded" data-item-id="{{ $item->id }}"
                            data-priority="{{ $item->priority }}">
                            <div class="flex items-center">
                                <label id="task-title-{{ $item->id }}" for="task-{{ $item->id }}" class="text-lg">
                                    {{ $item->title }}
                                </label>
                                <x-action-button action="/complete-item" method="POST" :item="$item->id">
                                    <button class="btn-primary bg-blue-400 p-2 rounded ms-8">
                                        Done
                                    </button>
                                </x-action-button>
                                <button type="button" data-edit-button="{{ $item->id }}" onclick="editItem({{ $item->id }})"
                                    class="btn-primary bg-yellow-400 p-2 rounded ms-2">
                                    Edit
                                </button>
                                <x-action-button action="/delete-item" method="POST" :item="$item->id">
                                    <button class="btn-primary bg-red-500 p-2 rounded ms-2">
                                        Delete
                                    </button>
                                </x-action-button>
                            </div>
                        </div>
                    @endif

                    @if ($item->priority === 'medium' && !$item->completed)
                        <div class="flex items-center justify-center mb-2 bg-yellow-200 p-2 rounded" data-item-id="{{ $item->id }}"
                            data-priority="{{ $item->priority }}">
                            <div class="flex items-center">
                                <label id="task-title-{{ $item->id }}" for="task-{{ $item->id }}" class="text-lg">
                                    {{ $item->title }}
                                </label>
                                <x-action-button action="/complete-item" method="POST" :item="$item->id">
                                    <button class="btn-primary bg-blue-400 p-2 rounded ms-8">
                                        Done
                                    </button>
                                </x-action-button>
                                <button type="button" data-edit-button="{{ $item->id }}" onclick="editItem({{ $item->id }})"
                                    class="btn-primary bg-yellow-400 p-2 rounded ms-2">
                                    Edit
                                </button>
                                <x-action-button action="/delete-item" method="POST" :item="$item->id">
                                    <button class="btn-primary bg-red-500 p-2 rounded ms-2">
                                        Delete
                                    </button>
                                </x-action-button>
                            </div>
                        </div>
                    @endif

                    @if ($item->priority === 'low' && !$item->completed)
                        <div class="flex flex-col items-center justify-center mb-2 bg-green-200 p-2 rounded"
                            data-item-id="{{ $item->id }}" data-priority="{{ $item->priority }}">
                            <div class="flex items-center">
                                <label id="task-title-{{ $item->id }}" for="task-{{ $item->id }}" class="text-lg">
                                    {{ $item->title }}
                                </label>
                                <x-action-button action="/complete-item" method="POST" :item="$item->id">
                                    <button class="btn-primary bg-blue-400 p-2 rounded ms-8">
                                        Done
                                    </button>
                                </x-action-button>
                                <button type="button" data-edit-button="{{ $item->id }}" onclick="editItem({{ $item->id }})"
                                    class="btn-primary bg-yellow-400 p-2 rounded ms-2">
                                    Edit
                                </button>
                                <x-action-button action="/delete-item" method="POST" :item="$item->id">
                                    <button class="btn-primary bg-red-500 p-2 rounded ms-2">
                                        Delete
                                    </button>
                                </x-action-button>
                            </div>
                        </div>
                    @endif
                @endforeach
            </div>

            <div class="w-1/2 mt-5">
                <h1 class="text-2xl font-bold text-center justify-center mb-8">
                    This is where i input my to do lists
                </h1>

                <div class="flex justify-center w-full mt-5">
                    <form action="/add-item" method="POST">
                        @csrf
                        <input type="text" name="title" placeholder="Enter a new task..."
                            class="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <select name="priority"
                            class="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>


        <div class="p-8">
            <h1 class="p-3 text-2xl font-bold text-center justify-center mb-8 mt-10">
                Completed Tasks
            </h1>
            @foreach ($items as $item)
                @if ($item->completed)
                    <div class="flex flex-col items-center justify-center bg-blue-400 p-4 rounded mt-5">
                        <label for="task-{{ $item->id }}">
                            {{ $item->title }}
                        </label>
                        <x-action-button action="/delete-item" method="POST" :item="$item->id">
                            <button class="btn-primary bg-red-500 p-2 rounded mt-2">
                                Delete
                            </button>
                        </x-action-button>
                    </div>
                @endif
            @endforeach
        </div>

    @else
        <section>
            <div class="mt-10">
                <h1 class="flex justify-center">
                    REGISTER
                </h1>
                <div class="flex justify-center align-center mt-5">
                    <form action="/register" method="POST">
                        @csrf
                        <input type="text" name="name" placeholder="Enter your name..."
                            class="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <input type="text" name="email" placeholder="Enter your email..."
                            class="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <input type="password" name="password" placeholder="Enter your password..."
                            class="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Register
                        </button>
                    </form>
                </div>
            </div>

            <div class="mt-10">
                <h1 class="flex justify-center">
                    LOGIN
                </h1>
                <div class="flex justify-center align-center mt-5">
                    <form action="/login" method="POST">
                        @csrf
                        <input type="text" name="login_name" placeholder="Enter your name..."
                            class="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <input type="password" name="login_password" placeholder="Enter your password..."
                            class="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Login
                        </button>
                    </form>
                </div>
            </div>

        </section>
    @endauth

</body>

</html>