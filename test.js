// import gsap from "gsap";
// import ScrollTrigger from "gsap-trial/ScrollTrigger";

//register the plugin
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(Flip);

const toSlide1 = gsap.utils.toArray('.div1_inner');

const scrollTween = gsap.to(toSlide1, {
    xPercent: -100 * (toSlide1.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: ".div1",
        pin: true,
        scrub: 1,
        snap: 1 / (toSlide1.length - 1),
        end: () => toSlide1.reduce((acc, x) => (acc + x.offsetWidth), 0),
    }
});

const container = document.querySelector('.div1_inner1');
const circles = container.querySelectorAll('.circle');
const circles_hidden = container.querySelectorAll('.circle_hidden');
const radius = 250;
const centerX = container.offsetWidth / 2;
const centerY = container.offsetHeight / 2;

circles.forEach((el, i) => {
    const angle = (i / circles.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle) - el.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - el.offsetHeight / 2;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
});

circles_hidden.forEach((el, i) => {
    const angle = (i / circles_hidden.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle) - el.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - el.offsetHeight / 2;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    el.addEventListener("mouseenter", (e) => circlesEnter(e, i));
    el.addEventListener("mouseleave", circlesLeave);
});

let currCircle = -1;

function circlesEnter(e, i) {
    currCircle = i;
    document.addEventListener("mousemove", circlesMove);
}

function circlesMove(e) {
    if (currCircle === -1) return;

    const hiddenCircle = circles_hidden[currCircle];
    const rect = hiddenCircle.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    gsap.to(circles[currCircle], {
        x: mouseX,
        y: mouseY,
        duration: 0.3,
        ease: "sine.out",
    });
}

function circlesLeave() {
    if (currCircle === -1) return;

    gsap.to(circles[currCircle], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "sine.inOut",
    });

    currCircle = -1;
    document.removeEventListener("mousemove", circlesMove);
}

const flowerContainer = document.querySelector(".div1_inner2_inner");

gsap.to(".flower", {
    scrollTrigger: {
        trigger: flowerContainer,
        containerAnimation: scrollTween,
        start: "left center",
        scrub: 0.5
    },
    x: `+= ${flowerContainer.getBoundingClientRect().width} - 500`,
    duration: 4,
    motionPath: [{ scale: 0.7 }, { scale: 0.2 }, { scale: 2 }, { scale: 1 }, { scale: 1.2 }],
    rotate: 360,
});

gsap.to(".flower1_text", {
    text: "test text",
    duration: 4,
    ease: "none",
    scrollTrigger: {
        trigger: ".flower1_text",
        id: "1",
        containerAnimation: scrollTween,
        start: "left center",
        scrub: 0.5
    }
});

gsap.to(".flower2_text", {
    text: "test text 2",
    duration: 4,
    ease: "none",
    scrollTrigger: {
        trigger: ".flower2_text",
        id: "2",
        containerAnimation: scrollTween,
        start: "left center",
        scrub: 0.5
    }
});

gsap.to(".flower3_text", {
    text: "test text 3",
    duration: 4,
    ease: "none",
    scrollTrigger: {
        trigger: ".flower3_text",
        id: "3",
        containerAnimation: scrollTween,
        start: "left center",
        scrub: 0.5
    }
});

const boxesContainer = document.querySelector(".div1_inner3");
const boxes = gsap.utils.toArray(".box");

boxes.forEach((box, index) => {
    if (index % 2 == 0) {
        gsap.from(box, {
            x: `-= ${box.getBoundingClientRect().right - boxesContainer.getBoundingClientRect().x}`,
            duration: 1,
            rotate: -360,
            scrollTrigger: {
                trigger: ".div1_inner3",
                onEnter: () => console.log("box1"),
                containerAnimation: scrollTween,
                scrub: 0.1
            }
        });
    } else {
        gsap.from(box, {
            x: `-= ${boxesContainer.getBoundingClientRect().x - box.getBoundingClientRect().left}`,
            duration: 1,
            rotate: 360,
            scrollTrigger: {
                trigger: ".div1_inner3",
                onEnter: () => console.log("box1"),
                containerAnimation: scrollTween,
                scrub: 0.1
            }
        });
    }
});

gsap.set("#linesvg", { opacity: 1 })
gsap.set("#motionSVG", { scale: 0.7, autoAlpha: 1 });
gsap.set("#tractor", { transformOrigin: "50% 50%" });
let rotateTo = gsap.quickTo("#tractor", "rotation"),
    prevDirection = 0;

gsap.to("#motionSVG", {
    scrollTrigger: {
        trigger: "#motionPath",
        start: "top center",
        end: () => "+=" + document.querySelector("#motionPath").getBoundingClientRect().height,
        scrub: 0.5,
        onUpdate: self => {
            if (prevDirection !== self.direction) {
                rotateTo(self.direction === 1 ? 0 : -180);
                prevDirection = self.direction;
            }
        }
    },
    ease: pathEase("#motionPath"),
    immediateRender: true,
    motionPath: {
        path: "#motionPath",
        align: "#motionPath",
        alignOrigin: [0.5, 0.5],
        autoRotate: 90,
    }
});

function pathEase(path, config = {}) {
    let axis = config.axis || "y",
        precision = config.precision || 1,
        rawPath = MotionPathPlugin.cacheRawPathMeasurements(MotionPathPlugin.getRawPath(gsap.utils.toArray(path)[0]), Math.round(precision * 12)),
        useX = axis === "x",
        start = rawPath[0][useX ? 0 : 1],
        end = rawPath[rawPath.length - 1][rawPath[rawPath.length - 1].length - (useX ? 2 : 1)],
        range = end - start,
        l = Math.round(precision * 200),
        inc = 1 / l,
        positions = [0],
        a = [0],
        minIndex = 0,
        smooth = [0],
        minChange = (1 / l) * 0.6,
        smoothRange = config.smooth === true ? 7 : Math.round(config.smooth) || 0,
        fullSmoothRange = smoothRange * 2,
        getClosest = p => {
            while (positions[minIndex] <= p && minIndex++ < l) { }
            a.push((p - positions[minIndex - 1]) / (positions[minIndex] - positions[minIndex - 1]) * inc + minIndex * inc);
            smoothRange && a.length > smoothRange && (a[a.length - 1] - a[a.length - 2] < minChange) && smooth.push(a.length - smoothRange);
        },
        i = 1;
    for (; i < l; i++) {
        positions[i] = (MotionPathPlugin.getPositionOnPath(rawPath, i / l)[axis] - start) / range;
    }
    positions[l] = 1;
    for (i = 0; i < l; i++) {
        getClosest(i / l);
    }
    a.push(1);
    if (smoothRange) {
        smooth.push(l - fullSmoothRange + 1);
        smooth.forEach(i => {
            let start = a[i],
                j = Math.min(i + fullSmoothRange, l),
                inc = (a[j] - start) / (j - i),
                c = 1;
            i++;
            for (; i < j; i++) {
                a[i] = start + inc * c++;
            }
        });
    }
    l = a.length - 1;
    return p => {
        let i = p * l,
            s = a[i | 0];
        return i ? s + (a[Math.ceil(i)] - s) * (i % 1) : 0;
    }
}

const motionPathData =
    "M-399.25379,-340.71797 C-399.25379,-340.71797 386.70813,-284.92113 420.50613,-152.49513 454.28013,-20.09013 -159.91287,-245.09513 -159.91287,-91.90313 -159.91287,61.26087 378.10113,-103.60513 384.90413,21.27287 391.70213,146.13787 122.70503,104.22685 122.70503,104.22685 ";

const exitPathData =
    "M579.41621,-174.11096 C579.41621,-174.11096 502.92821,-184.48396 411.31121,-159.05496 309.72221,-130.85696 292.54621,-121.82696 196.91321,-90.59496 134.95521,-70.35696 62.36621,-19.28196 55.60721,29.13604 48.81421,77.74604 120.07209,102.90601 120.07209,102.90601 ";

gsap.set(".alien", {
    xPercent: -50,
    yPercent: -20,
    autoAlpha: 1,
    transformOrigin: "50% 50%"
});
gsap.to(".star", {
    duration: 1,
    opacity: 0.2,
    stagger: {
        each: 0.5,
        yoyo: true,
        repeat: -1,
        repeatDelay: 0,
        ease: "Power1.easeInOut",
        from: "start"
    }
});

function alien() {
    var tl = gsap.timeline({ defaults: { ease: Power1.easeOut } })
        .addLabel("tiltOne", 0.2)
        .addLabel("tiltTwo", 0.7)
        .addLabel("tiltThree", 1.6)
        .to(".alien", {
            duration: 10,
            immediateRender: true,
            ease: Elastic.easeOut.config(1, 1.2),
            motionPath: motionPathData
        }, 0)
        .from(".alien", {
            duration: 4,
            scale: 0.1,
            immediateRender: false
        }, 0)
        .to(".alien", {
            duration: 0.5,
            rotate: "15deg",
            ease: Power1.easeInOut
        }, "tiltOne")
        .to(".alien", {
            duration: 0.5,
            rotate: "-15deg",
            ease: Power1.easeInOut
        }, "tiltTwo")
        .to(".alien", {
            duration: 0.5,
            rotate: "15deg",
            ease: Power1.easeInOut
        }, "tiltThree")
        .to(".alien", {
            duration: 0.7,
            rotate: "0deg",
            ease: Back.easeOut.config(8)
        }, "tiltThree+=1");

    return tl;
}
function sheep() {
    var tl = gsap.timeline({ defaults: { ease: Power1.easeOut } })
        .from(".head", {
            duration: 0.2,
            ease: Power1.easeInOut,
            rotate: "30deg",
            transformOrigin: "0% 50%",
            xPercent: 5,
            yPercent: 32
        })
        .to(".head", {
            duration: 0.4,
            ease: Power1.easeInOut,
            rotate: "-80deg",
            transformOrigin: "0% 50%",
            xPercent: 10,
            yPercent: 10
        }, "+=1")

        .to(".sheep", {
            duration: 0.4,
            ease: Power1.easeInOut,
            rotate: "50deg",
            transformOrigin: "100% 50%",
            yPercent: -30,
            xPercent: -20
        })
        .to(".head", {
            duration: 0.4,
            ease: Power1.easeInOut,
            rotate: "-15deg",
            transformOrigin: "0% 50%"
        }, "+=0.2")
        .fromTo(".leg", {
            duration: 0.1,
            rotate: "30deg",
            transformOrigin: "50% 0%",
            immediateRender: false
        },
            {
                duration: 0.1,
                rotate: "-30deg",
                transformOrigin: "50% 0%",
                immediateRender: false,
                stagger: {
                    each: 0.1,
                    yoyo: true,
                    repeat: 12,
                    repeatDelay: 0,
                    ease: "Power1.easeInOut",
                    from: "start"
                }
            }, "-=1")
        .to(".sheep", {
            duration: 0.4,
            ease: Power1.easeInOut,
            transformOrigin: "50% 50%",
            yPercent: -250,
            scale: 0.6,
            opacity: 0
        }, "-=0.8");

    return tl;
}
function lightOpen() {
    var tl = gsap.timeline({ defaults: { ease: Power1.easeOut } })
        .to(".sheep", { duration: 0.01, autoAlpha: 1 })
        .from(".light", {
            duration: 0.2,
            scaleX: 0,
            transformOrigin: "50% 0%"
        }, 0)
        .to(".groundlight", {
            autoAlpha: 1
        }, 0)
        .from(".groundlight", {
            duration: 0.2,
            scale: 0,
            transformOrigin: "50%, 50%"
        }, 0)
        .to(".lightcircle", {
            duration: 0.2,
            opacity: 1
        }, 0)
        .to(".lightring", {
            fill: "#9bf1ed"
        }, 0)
    return tl;
}
function alienExit() {
    var tl = gsap.timeline({ defaults: { ease: Power1.easeOut } })
        .to(".light", {
            duration: 0.2,
            scaleX: 0,
            transformOrigin: "50% 0%"
        }, 0)
        .to(".groundlight", {
            duration: 0.2,
            scale: 0,
            transformOrigin: "50%, 50%"
        }, 0)
        .to(".lightcircle", {
            duration: 0.2,
            opacity: 0
        }, 0)
        .to(".lightring", {
            fill: "#fff"
        }, 0)
        .to(".alien", {
            ease: Power2.easeOut,
            duration: 1.5,
            scale: 0,
            motionPath: {
                path: exitPathData,
                start: 1,
                end: 0,
            }
        }, "-=0.3")
    return tl;
}

const mainTimeline = gsap.timeline({
    defaults: { ease: Power1.easeOut }, scrollTrigger: {
        trigger: ".div1_inner4",
        start: "center center",
        containerAnimation: scrollTween,
    },
    repeat: -1
})
    .add(alien(), 0.5)
    .add(lightOpen(), 3.2)
    .add(sheep(), 3.4)
    .add(alienExit(), 7)

function hlTextEnter(e) {
    hlTextMove(e);
    document.addEventListener("mousemove", hlTextMove);
}

function hlTextOut(e) {
    gsap.to(".div1_inner5_text1", {
        "--x": `50%`,
        "--y": `50%`,
        duration: 0.3,
        ease: "sine.out"
    })
    document.removeEventListener("mousemove", hlTextMove);
}

function hlTextMove(e) {
    gsap.to(".div1_inner5_text1", {
        "--x": `${Math.round((e.clientX / window.innerWidth) * 100)}%`,
        "--y": `${Math.round((e.clientY / window.innerHeight) * 100)}%`,
        duration: 0.3,
        ease: "sine.out"
    })
}

const div1_inner5_text = document.querySelector(".div1_inner5");
div1_inner5_text.onmouseenter = (e) => hlTextEnter(e);
div1_inner5_text.onmouseleave = (e) => hlTextOut(e);

gsap.to(".image__hero", {
    scrollTrigger: {
        trigger: ".image__hero",
        scrub: true,
        pin: true,
        start: "center center",
        end: "bottom -100%",
        toggleClass: "image__active",
        ease: "power2"
    }
});

gsap.to(".image__hero__image", {
    scrollTrigger: {
        trigger: ".image__hero",
        scrub: 0.5,
        start: "top bottom",
        end: "bottom -300%",
        ease: "power2"
    },
    y: "-30%"
});

const text_container = document.querySelector(".text_container");
const text_blocks = gsap.utils.toArray(".text");

text_blocks.forEach((block, index) => {
    gsap.to(block, {
        duration: 5,
        opacity: 1,
        scrollTrigger: {
            trigger: block,
            scrub: 0.5
        }
    });

    if (index === 0) {
        gsap.to(".text_container", {
            duration: 2,
            backgroundImage: "https://media.istockphoto.com/id/1069539210/photo/fantastic-autumn-sunset-of-hintersee-lake.jpg?s=1024x1024&w=is&k=20&c=vnl41_uyRdK5xkS26wHMDyUTeOA1PTEyyKSZZQklkmQ=",
            scrollTrigger: {
                trigger: block,
                scrub: 0.5
            }
        });
    } else if (index === 1) {
        gsap.to(".text_container", {
            duration: 2,
            backgroundImage: "https://media.istockphoto.com/id/841278554/photo/beautiful-morning-light-in-public-park-with-green-grass-field.jpg?s=1024x1024&w=is&k=20&c=5n5BuqdDCb2KgdugAVfS93VwjsRWNcHQPhUp7pa-2r4=",
            scrollTrigger: {
                trigger: block,
                scrub: 0.5
            }
        });
    } else {
        gsap.to(".text_container", {
            duration: 2,
            backgroundImage: "https://media.istockphoto.com/id/1302442639/photo/view-from-dune-top-over-north-sea.jpg?s=1024x1024&w=is&k=20&c=Pv9pNg8_Fi1UY6xS8eAvoF-tFTNamZ6jGItOa2ByriI=",
            scrollTrigger: {
                trigger: block,
                scrub: 0.5
            }
        });
    }
})

const images = gsap.utils.toArray('.img');

document.body.style.overflow = 'auto';
document.scrollingElement.scrollTo(0, 0);

gsap.utils.toArray('.section').forEach((section, index) => {
    const w = section.querySelector('.wrapper');
    const [x, xEnd] = (index % 2) ? ['100%', (w.scrollWidth - section.offsetWidth) * -1] : [w.scrollWidth * -1, 0];
    gsap.fromTo(w, { x }, {
        x: xEnd,
        scrollTrigger: {
            trigger: section,
            scrub: 0.5
        }
    });
});

let container1 = document.querySelector(".inner3_container1"),
    container2 = document.querySelector(".inner3_container2"),
    boxes_ = gsap.utils.toArray(".inner3_box");

document.querySelector("button").addEventListener("click", () => {

    const state = Flip.getState(".inner3_box"); // selector text, an Element, NodeList or Array

    // shuffle & swap containers
    const newContainer = boxes_[0].parentNode === container1 ? container2 : container1;
    gsap.utils.shuffle(boxes_).forEach(box => newContainer.appendChild(box));

    Flip.from(state, {
        duration: 1,
        ease: "power1.inOut",
        stagger: 0.2,
        spin: true
    });


});
