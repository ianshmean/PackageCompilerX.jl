var documenterSearchIndex = {"docs":
[{"location":"examples/ohmyrepl.html#Creating-a-sysimage-with-OhMyREPL-1","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"","category":"section"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"OhMyREPL.jl is a package that enhances the REPL with, for example, syntax highlighting. It does, however, come with a bit of a startup time increase so compiling a new system image with OhMyREPL included is useful. Importing the OhMyREPL package is not the only factor that contributes to the extra load time from using OhMyREPL In addition, the time of compiling functions that OhMyREPL uses is also a factor. Therefore, we also want to do Profile Guided Precompilation (PGP) where we record what functions gets compiled when using OhMyREPL so they can be cached into the system image. OhMyREPL is a bit different from most other packages in that is used interactive. Normally to do PGP with PackageCompilerX we pass a script to to execute as the precompile_exectution_file which is used to collect compilation data,  but in this case, we will use Julia to manually collect this data.","category":"page"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"First install OhMyREPL in the global environement using import Pkg; Pkg.add(\"OhMyREPL\"). Run using OhMyREPL and write something (like 1+1). It should be syntax highlighted but you might have noticed that there was a bit of a delay before the characters appeared. This is the extra latency from using the package that we want to get rid off.","category":"page"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"(Image: OhMyREPL installation)","category":"page"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"The first goal is to have Julia emit the functions it compiles when running OhMyREPL. To this end, start Julia with the --trace-compile=ohmyrepl_precompile flag. This will start a normal-looking Julia session but all functions that get compiled are output to the file ohmyrepl_precompile. In the Julia session, load OhMyREPL, use the REPL a bit so that the functionality of OhMyREPL is exercised. Quit Julia and look into the file ohmyrepl_precompile. It should be filled with lines like:","category":"page"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"precompile(Tuple{typeof(OhMyREPL.Prompt.insert_keybindings), Any})\nprecompile(Tuple{typeof(OhMyREPL.__init__)})","category":"page"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"These are functions that Julia compiled. We now just tell create_sysimage to use these precompile statements when creating the system image:","category":"page"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"PackageCompilerX.create_sysimage(:OhMyREPL; precompile_statements_file=\"ohmyrepl_precompile\", replace_default=true)","category":"page"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"Restart julia and start typing something. If everything went well you should see the type text become highlighted with a significantly smaller delay than before creating the new system image","category":"page"},{"location":"examples/ohmyrepl.html#","page":"Creating a sysimage with OhMyREPL","title":"Creating a sysimage with OhMyREPL","text":"note: Note\nIf you want to go back to the default sysimage you can runPackageCompilerX.restore_default_sysimage()","category":"page"},{"location":"prereq.html#Prerequisites-1","page":"Prerequisites","title":"Prerequisites","text":"","category":"section"},{"location":"prereq.html#","page":"Prerequisites","title":"Prerequisites","text":"In order to use this package you need either gcc or clang installed and on the path.","category":"page"},{"location":"prereq.html#","page":"Prerequisites","title":"Prerequisites","text":"The package currently only works on Linux and macOS with Windows support being a work in progress.","category":"page"},{"location":"prereq.html#","page":"Prerequisites","title":"Prerequisites","text":"In the future, we hope to avoid this by automatically providing a working compiler with the package.","category":"page"},{"location":"sysimages.html#Sysimages-1","page":"Sysimages","title":"Sysimages","text":"","category":"section"},{"location":"sysimages.html#What-is-a-sysimage-1","page":"Sysimages","title":"What is a sysimage","text":"","category":"section"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"A sysimage is a file which, in a loose sense, contains a Julia session serialized to a file.  A \"Julia session\" include things like loaded packages, global variables, inferred and compiled code, etc.  By starting Julia with a sysimage, the stored Julia session is deserialized and loaded. The idea behind the sysimage is that this deserialization is faster than having to reload packages and recompile code from scratch.","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"Julia ships with a sysimage that is used by default when Julia is started. That sysimage contains the Julia compiler itself, the standard libraries and also compiled code (precompile statements) that has been put there to reduce the time required to do common operations, like working in the REPL.","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"Sometimes, it is desirable to create a custom sysimage with custom precompile statements. This is the case if one has some dependencies that take a significant time to load or where the compilation time for the first call is uncomfortably long. This section of the documentation is intended to document how to use PackageCompilerX to create such sysimages.","category":"page"},{"location":"sysimages.html#Drawbacks-to-custom-sysimages-1","page":"Sysimages","title":"Drawbacks to custom sysimages","text":"","category":"section"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"It should be clearly stated that there are some drawbacks to using a custom sysimage, thereby sidestepping the standard Julia package precompilation system.  The biggest drawback is that packages that are compiled into a sysimage (including their dependencies!) are \"locked\" to the version they where at when the sysimage was ( created.  This means that no matter what package version you have installed in your current project, the one in the sysimage will take precedence. This can lead to bugs where you start with a project that needs a specific version of a package, but you have another one compiled into the sysimage. ","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"Putting packages in the sysimage is therefore only recommended if the load time of the packages getting put in there is a significant problem and that these are not frequently updated. In addition, compiling \"workflow packages\" like Revise.jl and OhMyREPL.jl might make sense.","category":"page"},{"location":"sysimages.html#Creating-a-sysimage-using-PackageCompilerX-1","page":"Sysimages","title":"Creating a sysimage using PackageCompilerX","text":"","category":"section"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"PackageCompilerX provides the function create_sysimage to create a sysimage.  It takes as the first argument a package or a list of packages that should be embedded in the resulting sysimage. By default, the given packages are loaded from the active project but a specific project can be specified by giving a path with the project keyword. The location of the resulting sysimage is given by the sysimage_path keyword.  After the sysimage is created, giving the command flag -Jpath/to/sysimage will start Julia with the given sysimage.","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"As an example, below, a new sysimage in a separate project is created with the package Example.jl in it. Using Base.loaded_modules it can be seen that the package is loaded without having to explicitly import it. ","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"~\n❯ mkdir NewSysImageEnv\n\n~\n❯ cd NewSysImageEnv\n\n~/NewSysImageEnv 29s\n❯ julia -q\n\njulia> using PackageCompilerX\n[ Info: Precompiling PackageCompilerX [dffaa6cc-da53-48e5-b007-4292dfcc27f1]\n\n(v1.3) pkg> activate .\nActivating new environment at `~/NewSysImageEnv/Project.toml`\n\n(NewSysImageEnv) pkg> add Example\n  Updating registry at `~/.julia/registries/General`\n  Updating git-repo `https://github.com/JuliaRegistries/General.git`\n Resolving package versions...\n  Updating `~/NewSysImageEnv/Project.toml`\n  [7876af07] + Example v0.5.3\n  Updating `~/NewSysImageEnv/Manifest.toml`\n  [7876af07] + Example v0.5.3\n\njulia> create_sysimage(:Example; sysimage_path=\"ExampleSysimage.so\")\n[ Info: PackageCompilerX: creating system image object file, this might take a while...\n\njulia> exit()\n\n~/NewSysImageEnv\n❯ ls\nExampleSysimage.so  Manifest.toml  Project.toml\n\n~/NewSysImageEnv\n❯ julia -q -JExampleSysimage.so\n\njulia> Base.loaded_modules\nDict{Base.PkgId,Module} with 34 entries:\n...\n  Example [7876af07-990d-54b4-ab0e-23690620f79a]          => Example\n...","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"Alternatively, instead of giving a path to where the new sysimage should appear, one can choose to replace the default sysimage. This is done by omitting the sysimage_path keyword and instead adding replace_default=true, for example:","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"create_sysimage([:Debugger, :OhMyREPL]; replace_default=true)","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"If this is the first time create_sysimage is called with replace_default, a backup of the default sysimage is created. The default sysimage can then be restored with restore_default_sysimg().","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"Note that sysimages are created \"incrementally\" in the sense that they add to the sysimage of the process running PackageCompilerX. If the default sysimage has been replaced, the next create_sysimage call will create a new sysimage based on the replaced sysimage. It is possible to create a sysimage non-incrementally by passing the incremental=false keyword. This will create a new system image from scratch, however, it will lose the special precompilation that the Julia bundled sysimage provides which is what make the REPL and package manager snappy. It is therefore unlikely that incremental=false is of much use unless in special cases for sysimage creation (for apps it is a different story though).","category":"page"},{"location":"sysimages.html#Precompilation-1","page":"Sysimages","title":"Precompilation","text":"","category":"section"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"The step where we included Example.jl in the sysimage meant that loading Example is now pretty much instant (the package is already loaded when Julia starts). However, functions inside Example.jl still need to be compiled when executed for the first time.  One way we can see this is by using the --trace-compile=stderr flag which outputs a \"precompile statement\" every time Julia compiles a function.  Running the hello function inside Example.jl we can see that it needs to be compiled (it shows the function Example.hello was compiled for the input type String.","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"~/NewSysImageEnv\n❯ julia -JExampleSysimage.so --trace-compile=stderr -e 'import Example; Example.hello(\"friend\")'\nprecompile(Tuple{typeof(Example.hello), String})","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"To remedy this, we can give a \"precompile script\" to create_sysimage which causes functions executed in that script to be baked into the sysimage. As an example, the script below simply calls the hello function in Example:","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"~/NewSysImageEnv\n❯ cat precompile_example.jl\nusing Example\nExample.hello(\"friend\")","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"We now create a new system image called ExampleSysimagePrecompile.so where the precompile_execution_file keyword argument has been giving, pointing to the file just shown above:","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"~/NewSysImageEnv\n❯ julia-q\n\njulia> using PackageCompilerX\n\n(v1.3) pkg> activate .\nActivating environment at `~/NewSysImageEnv/Project.toml`\n\njulia> PackageCompilerX.create_sysimage(:Example; sysimage_path=\"ExampleSysimagePrecompile.so\",\n                                         precompile_execution_file=\"precompile_example.jl\")\n[ Info: PackageCompilerX: creating system image object file, this might take a while...\n\njulia> exit()","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"Using the just created system image, we can see that the hello function no longer needs to get compiled_:","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"~/NewSysImageEnv\n❯ julia -JExampleSysimagePrecompile.so --trace-compile=stderr -e 'import Example; Example.hello(\"friend\")'\n\n~/NewSysImageEnv\n❯","category":"page"},{"location":"sysimages.html#Using-a-manually-generated-list-of-precompile-statements-1","page":"Sysimages","title":"Using a manually generated list of precompile statements","text":"","category":"section"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"Starting Julia with --trace-compile=file.jl will emit precompilation statements to file.jl for the duration of the started Julia process.  This can be useful in cases where it is difficult to give a script that executes the code (like with interactive use). A file with a list of such precompile statements can be used when creating a sysimage by passing the keyword argument precompile_statements_file. See the OhMyREPL.jl example in the docs for more details on how to use --trace-compile with PackageCompilerX.","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"It is also possible to use [SnoopCompile.jl][snoop-url] to create files with precompilation statements.","category":"page"},{"location":"sysimages.html#","page":"Sysimages","title":"Sysimages","text":"[snoop-url]: https://timholy.github.io/SnoopCompile.jl/stable/snoopi/#auto-1","category":"page"},{"location":"index.html#PackageCompilerX-1","page":"Home","title":"PackageCompilerX","text":"","category":"section"},{"location":"index.html#","page":"Home","title":"Home","text":"PackageCompilerX is a Julia package with two main purposes:","category":"page"},{"location":"index.html#","page":"Home","title":"Home","text":"Creating custom sysimages for reduced latency when working locally with packages that has a high startup time.\nCreating \"apps\" which are a bundle of files including an executable that can be sent and run on other machines without Julia being installed on that machine.","category":"page"},{"location":"index.html#","page":"Home","title":"Home","text":"The manual contains some uses of Linux commands like ls (dir in Windows) and cat but hopefully these commands are common enough that the points still come across.","category":"page"},{"location":"refs.html#References-1","page":"References","title":"References","text":"","category":"section"},{"location":"refs.html#","page":"References","title":"References","text":"PackageCompilerX.create_sysimage\nPackageCompilerX.restore_default_sysimg\nPackageCompilerX.create_app\nPackageCompilerX.audit_app","category":"page"},{"location":"refs.html#PackageCompilerX.create_sysimage","page":"References","title":"PackageCompilerX.create_sysimage","text":"create_sysimage(packages; sysimage_path, project, precompile_execution_file, precompile_statements_file, incremental, filter_stdlibs, replace_default)\n\n\n\n\n\n\n","category":"function"},{"location":"refs.html#PackageCompilerX.restore_default_sysimg","page":"References","title":"PackageCompilerX.restore_default_sysimg","text":"restore_default_sysimg()\n\n\nlalala\n\n\n\n\n\n","category":"function"},{"location":"refs.html#PackageCompilerX.create_app","page":"References","title":"PackageCompilerX.create_app","text":"create_app(package_dir, app_dir; precompile_execution_file, precompile_statements_file, incremental, filter_stdlibs, audit, force)\n\n\n\n\n\n\n","category":"function"},{"location":"refs.html#PackageCompilerX.audit_app","page":"References","title":"PackageCompilerX.audit_app","text":"audit_app(app_dir)\n\n\nCheck for possible problems with regfards to relocatability at  the project at app_dir.\n\nwarning: Warning\nThis cannot guarantee that the project is free of relocatability problems, it can only detect some known bad cases and warn about those.\n\n\n\n\n\n","category":"function"},{"location":"apps.html#Apps-1","page":"Apps","title":"Apps","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"With an \"app\" we here mean a bundle of files where one of these files is an executable and where the bundle can be sent to another machine while still allowing the executable to run.","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"Use cases for Julia-apps is for example when one wants to provide some kind of functionality where the fact that it was written in Julia is just an implementation detail and forcing the user to download and use Julia to run the code would be a distraction. There is also no need to provide the original Julia source code for apps since everything gets baked into the sysimage.","category":"page"},{"location":"apps.html#Relocatability-1","page":"Apps","title":"Relocatability","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"Since we want to send the app to other machines the app we create must be \"relocatable\".  With an app being \"relocatable\" we mean it does not rely on specifics of the machine where the app was created.  Relocatability is not an absolute measure, most apps assume some properties of the machine they will run on, like what operating system is installed and the presence of graphics drivers if one want to show graphics. On the other hand, embedding things into the app that is most likely unique to the machine, like absolute paths, means that the application almost surely will not run properly on another machine.","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"For something to be relocatable, everything that it depends on must also be relocatable.  In the case of an app, the app itself and all the Julia packages it depends on must also relocatable. This is a bit of an issue because the Julia package ecosystem has not thought much about relocatability since app making has not been common in the Julia community. ","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"The main problem with relocatability of Julia packages is that many packages are encoding fundamentally non-relocatable into the source code.  As an example, many packages tend to use a build.jl file (which runs when the package is first installed) that looks something like:","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"lib_path = find_library(\"libfoo\")\nwrite(\"deps.jl\", \"const LIBFOO_PATH = $(repr(lib_path))\")","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"The main package file then contains","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"if !isfile(\"../build/deps.jl\")\n    error(\"run Pkg.build(\\\"Package\\\") to re-build Package\")\nend\ninclude(\"../build/deps.jl\")\nfunction __init__()\n    libfoo = Libdl.dlopen(LIBFOO_PATH)\nend\n","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"The absolute path to lib_path that find_library found is thus effectively included into the source code of the package. Arguably, the whole build system in Julia is inherently non-relocatable because it runs when the package is being installed which is a concept that doesn't make sense when distributing an app.","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"Some packages do need to call into external libraries and use external binaries so how are these packages supposed to do this in a relocatable way?  The answer is to use the \"artifact system\" which was described in the following [blog post][artifact-blog-url]. The artifact system is a declarative way of downloading and using \"external files\" like binaries and libraries.  How this is used in practice is described a bit later in this document.","category":"page"},{"location":"apps.html#Creating-an-app-1","page":"Apps","title":"Creating an app","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"The source of an app is a package with a project and manifest file. It should define a function with the signature","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"Base.@ccallable function julia_main()::Cint\n  ...\nend","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"which will be the entry point of the app (the function that runs when the executable in the app is run). A skeleton of an app to start working from can be found at https://github.com/KristofferC/PackageCompilerX.jl/tree/master/examples/MyApp.","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"Regarding relocatability, PackageCompilerX provides a function audit_app(app_dir::String) that tries to find common problems with relocatability in the app. ","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"The app is then compiled using the create_app function that takes a path to the source code of the app and the destination where the app should be compiled to. This will bundle all required libraries for the app to run on another machine where the same Julia that created the app could run.  As an example, below the example app linked above is compiled and run:","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"~/PackageCompilerX.jl/examples\n❯ julia -q --project\n\njulia> using PackageCompilerX\n\njulia> create_app(\"MyApp/\", \"MyAppCompiled\")\n[ Info: PackageCompilerX: creating base system image (incremental=false), this might take a while...\n[ Info: PackageCompilerX: creating system image object file, this might take a while...\n\njulia> exit()\n\n~/PackageCompilerX.jl/examples\n❯ MyAppCompiled/bin/MyApp\nARGS = [\"foo\", \"bar\"]\nBase.PROGRAM_FILE = \"MyAppCompiled/bin/MyApp\"\n...\nἔοικα γοῦν τούτου γε σμικρῷ τινι αὐτῷ τούτῳ σοφώτερος εἶναι, ὅτι ἃ μὴ οἶδα οὐδὲ οἴομαι εἰδέναι.\nunsafe_string((Base.JLOptions()).image_file) = \"/home/kc/PackageCompilerX.jl/examples/MyAppCompiled/bin/MyApp.so\"\nExample.domath(5) = 10\nsin(0.0) = 0.0","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"The resulting executable is found in the bin folder in the compiled app directory.  The compiled app directory MyAppCompiled could now be put into an archive and sent to another machine or an installer could be wrapped around the directory, perhaps providing a better user experience than just an archive of files.","category":"page"},{"location":"apps.html#Precompilation-1","page":"Apps","title":"Precompilation","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"In the same way as files for precompilation could be given when creating sysimages, the same keyword arguments are used to add precompilation to apps.","category":"page"},{"location":"apps.html#Incremental-vs-non-incremental-sysimage-1","page":"Apps","title":"Incremental vs non-incremental sysimage","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"In the section about creating sysimages, there was a short discussion about incremental vs non-incremental sysimages. In short, an incremental sysimage is built on top of another sysimage while a non-incremental is created from scratch. For sysimages, it made sense to use an incremental sysimage built on top of Julia's default sysimage since we wanted the benefit of having a snappy REPL that it provides.  For apps, this is no longer the case, the sysimage is not meant to be used when working interactively, it only needs to be specialized for the specific app.  Therefore, by default, incremental=true is used for create_app. If, for some reason, one wants an incremental sysimage, incremental=true could be passed to create_app.  With the example app, a non-incremental sysimage is about 70MB smaller than the default sysimage.","category":"page"},{"location":"apps.html#Filtering-stdlibs-1","page":"Apps","title":"Filtering stdlibs","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"By default, all standard libraries are included in the sysimage.  It is possible to only include those standard libraries that the project needs by passing the keyword argument filter_stdlibs=true to create_app.  This causes the sysimage to be smaller, and possibly load faster.  The reason this is not the default is that it is possible to \"accidentally\" depend on a standard library without it being reflected in the Project file.  For example, it is possible to call rand() from a package without depending on Random, even though that is where it is defined. If Random was excluded from the sysimage that call would then error. Same applies to matrix multiplication, rand(3,3) * rand(3,3) requires both LinearAlgebra and Random This is because these standard libraries do \"type piracy\" so just loading them can cause code to change behavior.","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"Nevertheless, the option is there to use, just make sure to properly test the app with the resulting sysimage.","category":"page"},{"location":"apps.html#Artifacts-1","page":"Apps","title":"Artifacts","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"The way to depend on external libraries or binaries when creating apps is by using the [artifact system][artifact-pkg-url]. PackageCompilerX will bundle all artifacts needed by the project, and set up things so that they can be found during runtime on other machines.","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"The example app uses the artifact system to depend on a very simple toy binary that prints some greek text. It is instructive to see how the artifact file is used in the source code","category":"page"},{"location":"apps.html#What-things-are-being-leaked-about-the-build-machine-and-the-source-code-1","page":"Apps","title":"What things are being leaked about the build machine and the source code","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"While the created app is relocatable and no source code is bundled with it, there are still some things about the build machine that can be observed.","category":"page"},{"location":"apps.html#Absolute-paths-of-build-machine-1","page":"Apps","title":"Absolute paths of build machine","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"Julia records the paths and line-numbers for methods when they are getting compiled.  These get cached into the sysimage and can be found e.g. by dumping all strings in the sysimage:","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"~/PackageCompilerX.jl/examples/MyAppCompiled/bin\n❯ strings MyApp.so | grep MyApp\nMyApp\n/home/kc/PackageCompilerX.jl/examples/MyApp/\nMyApp\n/home/kc/PackageCompilerX.jl/examples/MyApp/src/MyApp.jl\n/home/kc/PackageCompilerX.jl/examples/MyApp/src\nMyApp.jl\n/home/kc/PackageCompilerX.jl/examples/MyApp/src/MyApp.jl","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"This is a problem that Julia itself has:","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"julia> @which rand()\nrand() in Random at /buildworker/worker/package_linux64/build/usr/share/julia/stdlib/v1.3/Random/src/Random.jl:256","category":"page"},{"location":"apps.html#Using-reflection-and-finding-lowered-code-1","page":"Apps","title":"Using reflection and finding lowered code","text":"","category":"section"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"There is nothing preventing someone from starting Julia with the sysimage that comes with the app.  And while the source code is not available one can read the \"lowered code\" and use reflection to find things like the name of fields in structs and global variables etc:","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"~/PackageCompilerX.jl/examples/MyAppCompiled/bin kc/docs_apps*\n❯ julia -q -JMyApp.so\njulia> MyApp = Base.loaded_modules[Base.PkgId(Base.UUID(\"f943f3d7-887a-4ed5-b0c0-a1d6899aa8f5\"), \"MyApp\")]\nMyApp\n\njulia> names(MyApp; all=true)\n10-element Array{Symbol,1}:\n Symbol(\"#eval\")\n Symbol(\"#include\")\n Symbol(\"#julia_main\")\n Symbol(\"#real_main\")\n :MyApp\n :eval\n :include\n :julia_main\n :real_main\n :socrates\n\njulia> @code_lowered MyApp.real_main()\nCodeInfo(\n1 ─ %1  = MyApp.ARGS\n│         value@_2 = %1\n│   %3  = Base.repr(%1)\n│         Base.println(\"ARGS = \", %3)\n│         value@_2\n│   %6  = Base.PROGRAM_FILE\n│         value@_3 = %6\n│   %8  = Base.repr(%6)\n│         Base.println(\"Base.PROGRAM_FILE = \", %8)\n│         value@_3\n│   %11 = MyApp.DEPOT_PATH","category":"page"},{"location":"apps.html#","page":"Apps","title":"Apps","text":"[artifact-blog-url]: https://julialang.org/blog/2019/11/artifacts [artifact-pkg-url]: https://julialang.github.io/Pkg.jl/v1/artifacts/","category":"page"}]
}
