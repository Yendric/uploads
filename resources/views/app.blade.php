<!DOCTYPE HTML>
<!--
 __     __            _      _        _          
 \ \   / /           | |    (_)      | |         
  \ \_/ /__ _ __   __| |_ __ _  ___  | |__   ___ 
   \   / _ \ '_ \ / _` | '__| |/ __| | '_ \ / _ \
    | |  __/ | | | (_| | |  | | (__ _| |_) |  __/
    |_|\___|_| |_|\__,_|_|  |_|\___(_)_.__/ \___|

    Deze website is ontwikkeld door Yendric Van Roey
            (https://yendric.be)
-->
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>{{ config("app.name") }}</title>
    <meta name="author" content="Yendric Van Roey">
    <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    @viteReactRefresh
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
  </head>
  <body class="dark">
    @inertia
  </body>
</html>