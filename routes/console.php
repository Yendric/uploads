<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('uploads:clean-tmp')->daily();
