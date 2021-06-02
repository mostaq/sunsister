(function ($) {
    $.fn.dSlider = function (options) {
        const settings = $.extend({
            data: [],
            onItemActive: function () {
            }
        }, options)
        const plugin = this;
        if (settings.data.length > 0) {
            const sliderParentDiv = $("<div></div>").css({
                position: 'relative',
                height: "100%"
            })
            const upButton = $("<a href='#' id='up-button'></a>").css({
                'background-color': '#FFFFFF',
                color: '#000000',
                position: 'absolute',
                'z-index': 1000
            })
            const downButton = $("<a href='#' id='down-button'></a>").css({
                'background-color': '#FFFFFF',
                color: '#000000',
                position: 'absolute',
                'z-index': 1000
            })
            const sliderParent = $("<ul class='slider-3d'></ul>").css({
                position: 'relative',
                padding: 0,
                margin: 0,
                'list-style': 'none'
            });
            const sliderParent2d = $("<ul class='slider-2d'></ul>").css({
                position: 'relative',
                padding: 0,
                margin: 0,
                'list-style': 'none',
                width: '400px',
                'overflow': 'hidden'
            });
            $(this).append(sliderParentDiv).append(sliderParent2d)
            sliderParentDiv.append(sliderParent).append(upButton).append(downButton);
            const sParent = this;
            const activeItemIndex = Math.ceil((settings.data.length > 7 ? 7 : settings.data.length) / 2)
            const width2d = 260;
            const height2d = 130;
            const slider3dPosition = [];
            const [dx, dy, dz, perspective] = [100, 100, 100, 500];
            let parentWidth = 0;
            let parentHeight = 0;
            let firstTranslateX = 0;
            let lastTranslateX = 0;
            let firstTranslateY = 0;
            let lastTranslateY = 0;
            let currentItemIndex = activeItemIndex - 1;
            let currentItemIndex2d = activeItemIndex - 1;
            settings.data.forEach(function (item, i) {
                let x = (activeItemIndex - 1) * dx - i * dx;
                const y = -i * dy;
                let z = (activeItemIndex - 1) * dz - i * dz;
                x = x < 0 ? x * -1 : x;
                z = z > 0 ? z * -1 : z;
                const sliderChild = $("<li></li>").addClass('slider-item').css({
                    width: '400px',
                    height: '200px',
                    background: `url(${item.src}) top left no-repeat`,
                    'background-size': 'cover',
                    'list-style': 'none',
                    'transform': `translateX(${x}px) translateY(${y}px) perspective(${perspective}px) translateZ(${z}px)`,
                    'z-index': i + 1 - activeItemIndex < 0 ? i + 1 - activeItemIndex : activeItemIndex + 1 - i
                });
                // sliderChild.append($("<img/>").attr('src',item.src))
                sliderParent.append(sliderChild);
                sliderChild.css({
                    position: 'absolute',
                    top: i * sliderChild.outerHeight() + "px",
                    left: 0
                })
                if (i === 0) {
                    firstTranslateX = x;
                    firstTranslateY = y;
                    slider3dPosition.push({x: x + sliderChild[0].getBoundingClientRect().width, y: y, z: z,top:i * sliderChild.outerHeight()})
                }
                slider3dPosition.push({x: x, y: y, z: z,top:i * sliderChild.outerHeight()})
                if (i === settings.data.length - 1) {
                    lastTranslateX = x;
                    lastTranslateY = y;
                    slider3dPosition.push({x: x + sliderChild[0].getBoundingClientRect().width, y: y, z: z,top:i * sliderChild.outerHeight()})
                }
                if (activeItemIndex === i + 1) {
                    settings.onItemActive.call(plugin, item)
                    sliderChild.addClass('active-slider')
                }
                const offsetLeft = (sliderChild.offset().left - sliderParent.offset().left) + sliderChild[0].getBoundingClientRect().width;
                const offsetTop = (sliderChild.offset().top - sliderParent.offset().top) + sliderChild[0].getBoundingClientRect().height;
                if (i < 7) {
                    parentWidth = parentWidth < offsetLeft ? offsetLeft : parentWidth;
                    parentHeight = parentHeight < offsetTop ? offsetTop : parentHeight;
                }
            })
            settings.data.forEach(function (item, i) {
                const a = activeItemIndex - 1 - i;
                const x = -a * width2d + i * 20;
                const sliderChild2d = $("<li></li>").addClass('slider-item').css({
                    width: width2d + "px",
                    height: height2d + "px",
                    background: `url(${item.src}) top left no-repeat`,
                    'background-size': 'cover',
                    'list-style': 'none',
                    'z-index': 1
                });
                // sliderChild.append($("<img/>").attr('src',item.src))
                sliderParent2d.append(sliderChild2d);
                sliderChild2d.css({
                    position: 'absolute',
                    top: 0,
                    left: (x * 1) + "px"
                })
                if (activeItemIndex === i + 1) {
                    settings.onItemActive.call(plugin, item)
                    sliderChild2d.addClass('active-slider')
                }
            })
            if (this[0].offsetLeft + parentWidth > $(window).width()) {
                console.log("parentSize.left+parentWidth", parentWidth, this[0].offsetLeft)
                console.log("$(window).width()", $(window).width())
                parentWidth = parentWidth - (this[0].offsetLeft + parentWidth - $(window).width())
            }
            sliderParent2d.css({
                'height': height2d + 'px',
                'overflow': 'hidden',
                display: 'none'
            });

            sliderParent.css({
                'width': parentWidth + "px",
                'height': (parentHeight) + "px",
                'overflow': 'hidden',
                display: 'none'
            });
            sliderParentDiv.css({display:'none'})
            $(this)[0].getBoundingClientRect();
// lc.after(fcChild)
            /*console.log(`translateX(${(activeItemIndex-1)*dx-dx}px) translateY(${-dy}px) perspective(${perspective}px) translateZ(${-((activeItemIndex-1)*dz-dz)})`)
            $(`ul.slider-3d > li.slider-item:nth-child(1)`).css({
                'top': `${$("ul.slider-3d > li.slider-item:nth-child(1)").outerHeight()}px`,
                'transform': `translateX(${(activeItemIndex-1)*dx-dx}px) translateY(${-dy}px) perspective(${perspective}px) translateZ(${-((activeItemIndex-1)*dz-dz)}px)`,
                'z-index': 0,
                'opacity': 1,
                'transition': 'all 1s'
            })*/
            let timerId = 0
            let timerId2d = 0
            let timeoutId = 0
            if ($(window).width() < 991) {
                sliderParent.css("display", "none");
                sliderParentDiv.css("display", "none");
                sliderParent2d.css("display", "block");
                timerId2d = startSlider2d();
                $(plugin).addClass(" d-flex").addClass("justify-content-center")
            } else {
                console.log("getParentPosition()", getParentPosition());
                sliderParent2d.css("display", "none");
                sliderParentDiv.css("display", "block");
                sliderParent.css({"display": "block", "right": getParentPosition() + "px"});
                setUpDownButtonPosition();
                timerId = startSlider3d();
                $(plugin).removeClass(" d-flex").removeClass("justify-content-center")
            }

            $(window).resize(function () {
                if ($(this).width() < 991) {
                    clearInterval(timerId);
                    clearInterval(timerId2d);
                    sliderParent.css("display", "none");
                    sliderParentDiv.css("display", "none");
                    sliderParent2d.css("display", "block");
                    timerId2d = startSlider2d();
                    $(sParent).addClass(" d-flex").addClass("justify-content-center")
                } else {
                    clearInterval(timerId);
                    clearInterval(timerId2d);
                    sliderParent2d.css("display", "none");
                    sliderParentDiv.css("display", "block");
                    sliderParent.css({"display": "block", "right": getParentPosition() + "px"});
                    setUpDownButtonPosition();
                    timerId = startSlider3d();
                    $(sParent).removeClass(" d-flex").removeClass("justify-content-center")
                }
            })

            function setUpDownButtonPosition() {
                const position = $(`ul.slider-3d > li.slider-item:nth-child(${activeItemIndex})`).position();
                const rect = $(`ul.slider-3d > li.slider-item:nth-child(${activeItemIndex})`)[0].getBoundingClientRect();
                upButton.css({
                    left: '50px',
                    top: (position.top - 60) + "px"
                })
                downButton.css({
                    left: '50px',
                    top: (position.top + rect.height + 60) + "px"
                })
                console.log("position:", position);
            }

            function getParentPosition() {
                const rect = sliderParent[0].getBoundingClientRect();
                console.log("rect", rect);
                const tWidth = rect.left + parentWidth;
                if (tWidth > $(window).width()) {
                    return tWidth - $(window).width() + 4;
                }
                return 0;
            }

            function slider3D(dir = 'down') {
                const fc = $(`ul.slider-3d > li.slider-item:nth-child(1)`);
                const lc = $(`ul.slider-3d > li.slider-item:nth-child(${settings.data.length})`);
                let [tx, ty, tz, top, zIndex] = getXYZTZ(fc)
                let [x, y, z, t, zi] = getXYZTZ(lc)
                /*const fcChild = fc.clone(true).css({
                    'top': `${t}`,
                    'transform': `translateX(${lastTranslateX + lc[0].getBoundingClientRect().width}px) translateY(${lastTranslateY}px) perspective(${perspective}px) translateZ(${z}px)`,
                    'z-index': -1,
                    'opacity': 0,
                });
                const lcChild = lc.clone(true).css({
                    'top': `${top}`,
                    'transform': `translateX(${firstTranslateX + fc[0].getBoundingClientRect().width}px) translateY(${firstTranslateY}px) perspective(${perspective}px) translateZ(${tz}px)`,
                    'z-index': 0,
                    'opacity': 0,
                    'transition': 'all 0s'
                });*/

                const fcChild = fc.clone(true).css({
                    'top': `${t}`,
                    'transform': `translateX(${slider3dPosition[settings.data.length + 1].x}px) translateY(${slider3dPosition[settings.data.length + 1].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[settings.data.length + 1].z}px)`,
                    'z-index': -1,
                    'opacity': 0,
                });
                const lcChild = lc.clone(true).css({
                    'top': `${top}`,
                    'transform': `translateX(${slider3dPosition[0].x}px) translateY(${slider3dPosition[0].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[0].z}px)`,
                    'z-index': 0,
                    'opacity': 0,
                    'transition': 'all 0s'
                });

                if (dir === 'down') fc.before(lcChild)
                else lc.after(fcChild)
                $(`ul.slider-3d > li.slider-item`).removeClass('active-slider');
                console.log("current :", currentItemIndex);
                $(dir === 'down' ? `ul.slider-3d > li.slider-item:nth-child(n+2)` : `ul.slider-3d > li.slider-item`).each(function (i) {
                    if (dir === 'down' && i === settings.data.length - 1) {
                        // let [tx, ty, tz, top, zIndex] = getXYZTZ(fc)
                        lcChild.css({
                            'transform': `translateX(${slider3dPosition[1].x}px) translateY(${slider3dPosition[1].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[1].z}px)`,
                            'opacity': 1,
                            'transition': 'all .5s'
                        })
                        $(this).css({
                            'top': $(this).css('top'),
                            'transform': `translateX(${slider3dPosition[settings.data.length + 1].x}px) translateY(${slider3dPosition[settings.data.length + 1].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[settings.data.length + 1].z}px)`,
                            'z-index': -i,
                            'opacity': 0,
                            'transition': 'all .5s'
                        }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
                            $(this).remove();
                            currentItemIndex = currentItemIndex - 1 < 0 ? settings.data.length - 1 : currentItemIndex - 1;
                            settings.onItemActive.call(plugin, settings.data[currentItemIndex])
                        });
                    } else if (dir === 'up' && i === 0) {
                        fc.css({
                            'transform': `translateX(${slider3dPosition[0].x}px) translateY(${slider3dPosition[0].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[0].z}px)`,
                            'opacity': 0,
                            'transition': 'all .5s'
                        }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
                            $(this).remove();
                            currentItemIndex = currentItemIndex + 1 > settings.data.length ? 0 : currentItemIndex + 1;
                            settings.onItemActive.call(plugin, settings.data[currentItemIndex])
                        });
                    } else if (settings.data.length > 7 && ((i === 6 && dir==='down') || (i === 7 && dir==='up'))) {
                        const top = (i + 1) * $(this).outerHeight();
                        if(dir==='down'){
                            $(this).css({
                                'top': `${top}px`,
                                'transform': `translateX(${slider3dPosition[i + 2].x}px) translateY(${slider3dPosition[i + 2].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[i + 2].z}px)`,
                                'z-index': x < 0 ? -i : 1,
                                'opacity': 0,
                                'transition': 'all .5s'
                            }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {

                            })
                        }else{
                            $(this).css({
                                'top': `${slider3dPosition[i].top}px`,
                                'transform': `translateX(${slider3dPosition[i].x}px) translateY(${slider3dPosition[i].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[i].z}px)`,
                                'z-index': i-activeItemIndex < 0 ? i-activeItemIndex : activeItemIndex-i,
                                'opacity': 1,
                                'transition': 'all .5s'
                            }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {

                            })
                        }
                    } else {
                        const x = (activeItemIndex - 1) * dx - (i + 1) * dx;
                        const top = (i + 1) * $(this).outerHeight();
                        if(dir==='down') {
                            $(this).css({
                                'top': `${top}px`,
                                'transform': `translateX(${slider3dPosition[i + 2].x}px) translateY(${slider3dPosition[i + 2].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[i + 2].z}px)`,
                                'z-index': x < 0 ? -i : 1,
                                'opacity': 1,
                                'transition': 'all .5s'
                            }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {

                            })
                        } else {
                            $(this).css({
                                'top': `${slider3dPosition[i].top}px`,
                                'transform': `translateX(${slider3dPosition[i].x}px) translateY(${slider3dPosition[i].y}px) perspective(${perspective}px) translateZ(${slider3dPosition[i].z}px)`,
                                'z-index': i-activeItemIndex < 0 ? i-activeItemIndex : activeItemIndex-i,
                                'opacity': 1,
                                'transition': 'all .5s'
                            }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {

                            })
                        }
                    }

                });
                $(`ul.slider-3d > li.slider-item:eq(${activeItemIndex - 1})`).addClass('active-slider');

            }

            function startSlider3d() {
                return setInterval(function () {
                    slider3D()
                }, 3000)
            }

            function startSlider2d() {
                return setInterval(function () {
                    const fc = $(`ul.slider-2d > li.slider-item:nth-child(1)`);
                    const lc = $(`ul.slider-2d > li.slider-item:nth-child(${settings.data.length})`);
                    const fx = -(activeItemIndex - 1) * width2d;
                    const lx = -(activeItemIndex - settings.data.length) * width2d + (settings.data.length - 1) * 20;
                    const fcChild = fc.clone(true).css({
                        'top': 0,
                        'opacity': 0,
                        left: lx + 'px'
                    });
                    const lcChild = lc.clone(true).css({
                        'top': `0`, 'z-index': 0,
                        'opacity': 0,
                        left: fx + 'px'
                    });

                    fc.before(lcChild)
                    // fc.before()
                    $(`ul.slider-2d > li.slider-item`).removeClass('active-slider');
                    // currentItemIndex = currentItemIndex-1<0?settings.data.length-1:currentItemIndex-1;
                    $(`ul.slider-2d > li.slider-item:nth-child(n+2)`).each(function (i) {
                        if (i === settings.data.length - 1) {
                            // let [tx, ty, tz, top, zIndex] = getXYZTZ(fc)
                            lcChild.css({
                                left: fx + 'px',
                                'opacity': 1,
                                'transition': 'all .5s'
                            })
                            $(this).remove();
                            currentItemIndex2d = currentItemIndex2d - 1 < 0 ? settings.data.length - 1 : currentItemIndex2d - 1;
                            settings.onItemActive.call(plugin, settings.data[currentItemIndex2d])
                        } else {
                            const a = activeItemIndex - 1 - (i + 1);
                            const x = -a * width2d + (i + 1) * 20;
                            $(this).css({
                                'top': 0,
                                left: x + "px",
                                'opacity': 1,
                                'transition': 'all .5s'
                            }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {

                            })
                        }

                    });
                    $(`ul.slider-2d > li.slider-item:eq(${activeItemIndex - 1})`).addClass('active-slider');

                }, 3000)
            }

            upButton.on('click', function (e) {
                e.preventDefault();
                clearInterval(timerId)
                clearTimeout(timeoutId)
                timeoutId = setTimeout(function () {
                    timerId = startSlider3d();
                }, 5000)
                slider3D('up')
            })
            downButton.on('click', function (e) {
                e.preventDefault();
                clearInterval(timerId)
                clearTimeout(timeoutId)
                timeoutId = setTimeout(function () {
                    timerId = startSlider3d();
                }, 5000)
                slider3D('down')
            })
        }

        function getXYZTZ(jElem) {
            // console.log(jElem.css('transform'))
            const t = jElem.css('transform')?.split(",") || [];
            const [x, y, z, top, zIndex] = [t[12], t[13], t[14], jElem.css("top"), jElem.css("z-index")];
            return [x, y, z, top, zIndex];
        }
    }
}(jQuery))
