---
layout: post
authors: [tom_verelst]
title: "DockerCon 2017: LinuxKit and Moby"
image: /img/dockercon2017/thumbnail.jpg
tags: [DockerCon,Docker,Conference]
category: Conference
comments: true
---

Batteries included, but swappable.
That has always been the philosophy of Docker.
Since the incubation of Docker four years ago,
the project has undergone many evolutions.
Over the years, it has split up parts of Docker into smaller reusable components,
which moved to their own projects.
Docker, instead of being just one project,
can now be considered a composition of multiple projects.
We got runC, VPNKit, containerd, SwarmKit, InfraKit and so on.
These projects are now used by many other projects other than Docker.
Docker Inc. now open-sourced two new projects,
called **LinuxKit** and **The Moby Project**

# LinuxKit

![LinuxKit](/img/dockercon2017/linux-kit.png)

LinuxKit is a toolkit to create small, lean Linux subsystems.
The difference with other Linux distributions is the fact that you can create a distribution that only contains exactly what is needed.
All system services are containers and can be removed or replaced at will.
Docker partnered with multiple companies like Intel, HPE, ARM, IBM and Microsoft and the Linux Foundation,
to create this new component.
The minimal image size is only 35MB!
These portable distributions can be used to run Linux on platforms that do not support Linux out-of-the-box.
For example,
LinuxKit is now being used to run Linux containers on Windows Server,
using Hyper-V isolation techniques.
This means you can run both Windows and Linux containers side-by-side,
and create Linux/Windows hybrid clusters!

# The Moby Project

![Moby Project](/img/dockercon2017/moby.png)

Users have been asking for the Docker-native experience on their favorite platform.
These requests have not gone unheard.
We received Docker for Mac, Docker for Windows, Docker for AWS and Docker for Azure.
All these tools are built by composing the same open components that are used for Docker.
Docker now, in total, has a library of over 80 containerized components.
The problem here is,
a lot of work is duplicated,
to compose all these components together.
Each project has its own assembly system.

To fix this problem,
Docker Inc. looked at the automotive industry,
and copied the idea of **common assemblies**.
Just like cars can be completely different,
they can share the same chassis.
And this is how **the Moby project** was born.
It attempts to bring a set of standards and best practices together.
Instead of spending months of work tying all these loose components together,
you can now build a tool with the components you need within a few hours.

![Production Model](/img/dockercon2017/common-assemblies.png)

Docker stays true to its battery philosophy.
You can choose which version of the kernel you want,
you can choose to use which components you want.
It is all up to you!
An example shown at DockerCon was "RedisOS".
They composed LinuxKit, containerd and Redis,
and exported it to different formats that can run on Mac, Windows and GCP.
Since these distributions are so small and portable,
it is possible for companies to use this for IoT, cloud, desktop and many more platforms.
You can find some examples in the [LinuxKit examples repository](https://github.com/linuxkit/linuxkit/tree/master/examples).

# Trying it out

I wanted to try it out myself,
so I went to the [LinuxKit Github repository](https://github.com/linuxkit/linuxkit) and cloned it.

```
$ git clone git@github.com:linuxkit/linuxkit.git
```

Then I ran `make` to build the `moby` tool:

```
$ make
```

This created the `moby` tool in the `bin` directory.
I added this to my `PATH`:

```
$ export PATH=$PATH:$(pwd)/bin
```

Now that I have the Moby tool available and on my `PATH`,
I can build LinuxKit.
Let's take a look first at the YAML file that is used to build it.

```
$ cat linuxkit.yml
kernel:
  image: "mobylinux/kernel:4.9.x"
  cmdline: "console=ttyS0 console=tty0 page_poison=1"
init:
  - linuxkit/init:42fe8cb1508b3afed39eb89821906e3cc7a70551
  - mobylinux/runc:b0fb122e10dbb7e4e45115177a61a3f8d68c19a9
  - linuxkit/containerd:60e2486a74c665ba4df57e561729aec20758daed
  - mobylinux/ca-certificates:eabc5a6e59f05aa91529d80e9a595b85b046f935
onboot:
  - name: sysctl
    image: "mobylinux/sysctl:2cf2f9d5b4d314ba1bfc22b2fe931924af666d8c"
    net: host
    pid: host
    ipc: host
    capabilities:
     - CAP_SYS_ADMIN
    readonly: true
  - name: binfmt
    image: "linuxkit/binfmt:8881283ac627be1542811bd25c85e7782aebc692"
    binds:
     - /proc/sys/fs/binfmt_misc:/binfmt_misc
    readonly: true
  - name: dhcpcd
    image: "linuxkit/dhcpcd:48e249ebef6a521eed886b3bce032db69fbb4afa"
    binds:
     - /var:/var
     - /tmp/etc:/etc
    capabilities:
     - CAP_NET_ADMIN
     - CAP_NET_BIND_SERVICE
     - CAP_NET_RAW
    net: host
    command: ["/sbin/dhcpcd", "--nobackground", "-f", "/dhcpcd.conf", "-1"]
services:
  - name: rngd
    image: "mobylinux/rngd:3dad6dd43270fa632ac031e99d1947f20b22eec9"
    capabilities:
     - CAP_SYS_ADMIN
    oomScoreAdj: -800
    readonly: true
  - name: nginx
    image: "nginx:alpine"
    capabilities:
     - CAP_NET_BIND_SERVICE
     - CAP_CHOWN
     - CAP_SETUID
     - CAP_SETGID
     - CAP_DAC_OVERRIDE
    net: host
files:
  - path: etc/docker/daemon.json
    contents: '{"debug": true}'
trust:
  image:
    - mobylinux/kernel
outputs:
  - format: kernel+initrd
  - format: iso-bios
  - format: iso-efi
```

This YAML file contains all the necessary information to create a distribution,
that will be available in multiple formats.
In this case,
a random number generated and nginx are added as services.
Let's build it!

```
$ moby build linuxkit.yml
Extract kernel image: mobylinux/kernel:4.9.x
Add init containers:
Process init image: linuxkit/init:42fe8cb1508b3afed39eb89821906e3cc7a70551
Process init image: mobylinux/runc:b0fb122e10dbb7e4e45115177a61a3f8d68c19a9
Process init image: linuxkit/containerd:60e2486a74c665ba4df57e561729aec20758daed
Process init image: mobylinux/ca-certificates:eabc5a6e59f05aa91529d80e9a595b85b046f935
Add onboot containers:
  Create OCI config for mobylinux/sysctl:2cf2f9d5b4d314ba1bfc22b2fe931924af666d8c
  Create OCI config for linuxkit/binfmt:8881283ac627be1542811bd25c85e7782aebc692
  Create OCI config for linuxkit/dhcpcd:48e249ebef6a521eed886b3bce032db69fbb4afa
Add service containers:
  Create OCI config for mobylinux/rngd:3dad6dd43270fa632ac031e99d1947f20b22eec9
  Create OCI config for nginx:alpine
Add files:
  etc/docker/daemon.json
Create outputs:
  linuxkit-bzImage linuxkit-initrd.img linuxkit-cmdline
  linuxkit.iso
  linuxkit-efi.iso
```

You can see that a few init, onboot and service containers were added,
and a configuration file was added for Docker.
Finally,
you can see the tool was outputted in multiple formats.
Let's try to run it:

```
$ moby run linuxkit
# ...
# Lots of boot information
# ...
Welcome to LinuxKit

                        ##         .
                  ## ## ##        ==
               ## ## ## ## ##    ===
           /"""""""""""""""""\___/ ===
      ~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ /  ===- ~~~
           \______ o           __/
             \    \         __/
              \____\_______/


/ # [    2.464063] IPVS: Creating netns size=2104 id=1
[    2.464434] IPVS: ftp: loaded support on port[0] = 21
[    2.490221] tsc: Refined TSC clocksource calibration: 1993.943 MHz
[    2.490613] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x397ba967053, max_idle_ns: 881590807276 ns
[    2.713076] IPVS: Creating netns size=2104 id=2
[    2.713560] IPVS: ftp: loaded support on port[0] = 21
[    3.503395] clocksource: Switched to clocksource tsc
/ #
```

This image booted in just a few seconds!
Now let's see which service containers are running using runC:

```
/ # runc list
ID          PID         STATUS      BUNDLE                        CREATED                        OWNER
nginx       542         running     /run/containerd/linux/nginx   2017-04-19T12:34:42.1852841Z   root
rngd        601         running     /run/containerd/linux/rngd    2017-04-19T12:34:42.3200486Z   root
```

As you can see,
all the service containers are up and running.
Within just a few minutes,
I created a Linux distribution and got it up and running,
with everything running in a container.

If you would like to learn more about LinuxKit and the Moby Project,
you can check out the following resources:

* [The Moby Project](https://mobyproject.org/)
* [Docker Blog: Anouncing LinuxKit](https://blog.docker.com/2017/04/introducing-linuxkit-container-os-toolkit/)
* [Docker Blog: Introducing Moby Project](https://blog.docker.com/2017/04/introducing-the-moby-project/)
* [GitHub: LinuxKit](https://github.com/linuxkit/linuxkit)
* [GitHub: Moby](https://github.com/moby/moby)
