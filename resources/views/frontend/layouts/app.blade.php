<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/scss/app.scss', 'resources/css/app.css'])
    @stack('styles')
</head>

<body class="@yield('body_class')">

        @yield('content')


    <!-- scripts -->
    @vite('resources/js/app.js')
    @stack('scripts')
</body>

</html>
