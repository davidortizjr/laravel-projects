<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Support Desk</title>
    @vite(['resources/css/app.css'])
</head>

<body>
    @auth
        <div class="grid grid-flow-col w-full position-relative">
            <div class="col-span-1 h-screen overflow-hidden">
                <x-sidebar />
            </div>
            <div class="col-span-8 p-6">
                <h1 class="text-4xl font-bold m-6">
                    {{ isset($page) ? ucfirst($page) : 'Dashboard' }}
                </h1>
                @isset($page)
                    @include($page)

                @endisset
            </div>
        </div>

    @else
        <?php
        include resource_path('views/components/login.blade.php');
            ?>


    @endauth
</body>

</html>