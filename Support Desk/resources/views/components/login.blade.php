<div class="text-center mx-4 my-8 ">
    <div class="flex flex-col justify-center w-full">
        <div>
            <h1 class="text-3xl font-bold">Register</h1>
        </div>

        <div class="w-full flex justify-center mt-4">
            <form action="/register" method="POST" class="flex flex-col space-y-4 w-1/3">
                <input type="text" name="name" placeholder="Name" class="border border-gray-300 rounded px-4 py-2">
                <input type="email" name="email" placeholder="Email" class="border border-gray-300 rounded px-4 py-2">
                <input type="password" name="password" placeholder="Password"
                    class="border border-gray-300 rounded px-4 py-2">
                <button type="submit"
                    class="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Register</button>
            </form>
        </div>
    </div>

    <div class="flex flex-col justify-center w-full mt-8">
        <div>
            <h1 class="text-3xl font-bold">Login</h1>
        </div>

        <div class="w-full flex justify-center mt-4">
            <form action="/login" method="POST" class="flex flex-col space-y-4 w-1/3">
                <input type="text" name="name" placeholder="Name" class="border border-gray-300 rounded px-4 py-2">
                <input type="password" name="password" placeholder="Password"
                    class="border border-gray-300 rounded px-4 py-2">
                <button type="submit" class="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Login</button>
            </form>
        </div>
    </div>
</div>