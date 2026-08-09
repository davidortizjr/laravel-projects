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
        <div class="flex">
            <div class="flex h-screen overflow-hidden">
                <x-sidebar />
            </div>
            <section class="p-6 w-1/2">
                <h1 class="text-5xl font-bold m-6">
                    {{ isset($page) ? ucfirst($page) : 'Dashboard' }}
                </h1>
                @isset($page)
                    @include($page)

                @endisset
            </section>
        </div>

    @else
        <?php
        include resource_path('views/components/login.blade.php');
            ?>


    @endauth
</body>

</html>