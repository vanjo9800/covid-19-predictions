#!/bin/bash

git submodule sync;
git submodule update --remote;
git pull --recurse-submodules;