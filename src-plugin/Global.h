#pragma once

#include "Entry.h"
#include "gmlib/inclde_all.h"

#define MOD_NAME "GMLIB-Mod-Template"
#define selfMod  my_mod::Entry::getInstance()
#define logger   selfMod->getSelf().getLogger()
