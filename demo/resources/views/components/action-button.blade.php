<form action="{{ $action }}" method="POST" class="inline">
    @csrf

    @if (isset($method) && strtoupper($method) !== 'POST')
        @method($method)
    @endif

    {{ $slot }}
    <input type="hidden" name="item_id" value="{{ $item }}">

</form>