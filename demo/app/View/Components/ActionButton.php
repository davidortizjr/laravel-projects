<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ActionButton extends Component
{
    public string $action;

    public string $method;

    public mixed $item;

    /**
     * Create a new component instance.
     */
    public function __construct(string $action, string $method = 'POST', mixed $item = null)
    {
        $this->action = $action;
        $this->method = $method;
        $this->item = $item;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.action-button');
    }
}
