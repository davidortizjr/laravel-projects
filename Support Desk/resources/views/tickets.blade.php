<div>
    <form action="/create-tickets" method="POST">
        @csrf
        <div class="p-3">
            <label for="title">Title: </label>
            <input type="text" name="title" id="title" class="border border-gray-300 rounded-md p-2">

            <label for="description">Description: </label>
            <input type="text" name="description" id="description" class="border border-gray-300 rounded-md p-2">

            <label for="priority">Priority: </label>
            <select name="priority" id="priority" class="border border-gray-300 rounded-md p-2">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>

        <div>
            <button class="bg-blue-400 p-3">
                Create Ticket
            </button>
        </div>
    </form>
</div>

<div class="p-6">
    <div class="flex flex-row gap-4 justify-evenly">
        <div class="bg-white rounded-lg shadow-md p-6"> Tickets this week</div>
        <div class="bg-white rounded-lg shadow-md p-6"> Tickets Done</div>
        <div class="bg-white rounded-lg shadow-md p-6"> Tickets Pending</div>
    </div>
</div>
<div class="p-6">
    <div class="bg-white shadow-md p-6 rounded-lg width-full">
        <h2 class="text-2xl font-bold mb-4">Recent Tickets</h2>
        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th class="border-b py-2 px-4 text-left">ID</th>
                    <th class="border-b py-2 px-4 text-left">Title</th>
                    <th class="border-b py-2 px-4 text-left">Requester</th>
                    <th class="border-b py-2 px-4 text-left">Priority</th>
                    <th class="border-b py-2 px-4 text-left">Status</th>
                    <th class="border-b py-2 px-4 text-left">Created At</th>
                    <th class="border-b py-2 px-4 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($tickets as $ticket)
                    <tr>
                        <td class="border-b py-2 px-4"></td>
                        <td class="border-b py-2 px-4">{{ $ticket->title }}</td>
                        <td class="border-b py-2 px-4"> </td>
                        <td class="border-b py-2 px-4"> {{ $ticket->priority }}</td>
                        <td class="border-b py-2 px-4"> {{ $ticket->status }}</td>
                        <td class="border-b py-2 px-4"> {{ $ticket->created_at }}</td>
                        <td class="border-b py-2 px-4">
                            <a href="#" class="text-blue-500 hover:underline">View</a>
                            <a href="#" class="text-red-500 hover:underline ml-2">Delete</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>