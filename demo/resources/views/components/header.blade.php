<div class="text-xl font-bold text-center p-5 bg-gray-200 mb-5">
    <h1> this is a header for my to-do app</h1>
    <form action="/logout" method="POST">
        @csrf
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
        </button>
    </form>
</div>