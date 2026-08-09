<aside class="w-48 h-full bg-gray-800 text-white flex flex-col flex-shrink-0">
    <div class="flex flex-col h-full justify-between">
        <div class="flex flex-col p-6">
            <div class="flex flex-col">
                <a href="/dashboard" class="hover:text-gray-300">Dashboard</a>
            </div>
            <div class="flex flex-col pt-6">
                <a href="/tickets" class="hover:text-gray-300">Tickets</a>
            </div>
            <div class="flex flex-col pt-6">
                <a href="/users" class="hover:text-gray-300">Users</a>
            </div>
            <div class="flex flex-col pt-6">
                <a href="/profile" class="hover:text-gray-300">Profile</a>
            </div>
        </div>
        <div class="flex flex-col p-6 space-y-4">
            <form action="/logout" method="POST">
                @csrf
                <button type="submit" class="hover:text-gray-300">Logout</button>
            </form>
        </div>
    </div>

</aside>