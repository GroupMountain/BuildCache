add_rules("mode.debug", "mode.release")

add_repositories("groupmountain-repo https://github.com/GroupMountain/xmake-repo.git")
add_repositories("liteldev-repo https://github.com/LiteLDev/xmake-repo.git")

if not has_config("vs_runtime") then
    set_runtimes("MD")
end

add_requires("levilamina", "gmlib")
add_requires("levibuildscript 0.3.0")
add_requires("legacyremotecall")

target("BuildCache") -- Change this to your mod name.
    add_cxflags(
        "/EHa",
        "/utf-8"
    )
    add_defines(
        "NOMINMAX", 
        "UNICODE", 
        "_HAS_CXX17",
        "_HAS_CXX20",
        "_HAS_CXX23"
    )
    add_files(
        "src-plugin/**.cpp"
    )
    add_includedirs(
        "src-plugin"
    )
    add_packages(
        "levilamina",
        "gmlib",
        "legacyremotecall"
    )
    add_rules("@levibuildscript/linkrule")
    add_rules("@levibuildscript/modpacker")
    set_exceptions("none")
    set_kind("shared")
    set_languages("c++20")
    set_symbols("debug")
