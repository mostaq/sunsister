(function ($) {
    $.fn.dSlider = function (options) {
        const settings = $.extend({
            data:[],
            onItemActive:function (){}
        },options)
        const plugin = this;
        if(settings.data.length>0){
            const sliderParent = $("<ul class='slider-3d'></ul>").css({
                position:'relative',
                padding:0,
                margin:0,
                'list-style':'none'
            });
            const sliderParent2d = $("<ul class='slider-2d'></ul>").css({
                position:'relative',
                padding:0,
                margin:0,
                'list-style':'none',
                width:'400px',
                'overflow':'hidden'
            });
            $(this).append(sliderParent);
            $(this).append(sliderParent2d);
            const sParent = this;
            const activeItemIndex = Math.ceil(settings.data.length/2)
            const width2d = 260;
            const height2d = 130;
            const [dx,dy,dz,perspective] = [100,100,100,500];
            let parentWidth = 0;
            let parentHeight = 0;
            let firstTranslateX = 0;
            let lastTranslateX = 0;
            let firstTranslateY = 0;
            let lastTranslateY = 0;
            let currentItemIndex = activeItemIndex-1;
            let currentItemIndex2d = activeItemIndex-1;
            settings.data.forEach(function (item,i) {
                const x = (activeItemIndex-1)*dx-i*dx;
                const y = -i*dy;
                const z = (activeItemIndex-1)*dz-i*dz;
                if(i===0){
                    firstTranslateX =(x < 0 ? x * -1 : x);
                    firstTranslateY = y;
                }else if(i===settings.data.length-1){
                    lastTranslateX = (x < 0 ? x * -1 : x);
                    lastTranslateY = y;
                }
                const sliderChild = $("<li></li>").addClass('slider-item').css({
                    width:'400px',
                    height:'200px',
                    background:`url(${item.src}) top left no-repeat`,
                    'background-size':'cover',
                    'list-style':'none',
                    'transform': `translateX(${x < 0 ? x * -1 : x}px) translateY(${y}px) perspective(${perspective}px) translateZ(${z > 0 ? z * -1 : z}px)`,
                    'z-index': x < 0 ? -i : 1
                });
                // sliderChild.append($("<img/>").attr('src',item.src))
                sliderParent.append(sliderChild);
                sliderChild.css({
                    position:'absolute',
                    top:i*sliderChild.outerHeight()+"px",
                    left:0
                })
                if(activeItemIndex===i+1){
                    settings.onItemActive.call(plugin,item)
                    sliderChild.addClass('active-slider')
                }
                const offsetLeft = (sliderChild.offset().left-sliderParent.offset().left)+sliderChild[0].getBoundingClientRect().width;
                const offsetTop = (sliderChild.offset().top-sliderParent.offset().top)+sliderChild[0].getBoundingClientRect().height;
                parentWidth = parentWidth<offsetLeft?offsetLeft:parentWidth;
                if(i<7) parentHeight = parentHeight<offsetTop?offsetTop:parentWidth;
            })
            settings.data.forEach(function (item,i) {
                const a = activeItemIndex-1-i;
                const x = -a*width2d+i*20;
                const sliderChild2d = $("<li></li>").addClass('slider-item').css({
                    width:width2d+"px",
                    height:height2d+"px",
                    background:`url(${item.src}) top left no-repeat`,
                    'background-size':'cover',
                    'list-style':'none',
                    'z-index': 1
                });
                // sliderChild.append($("<img/>").attr('src',item.src))
                sliderParent2d.append(sliderChild2d);
                sliderChild2d.css({
                    position:'absolute',
                    top:0,
                    left:(x*1)+"px"
                })
                if(activeItemIndex===i+1){
                    settings.onItemActive.call(plugin,item)
                    sliderChild2d.addClass('active-slider')
                }
            })
            if(this[0].offsetLeft+parentWidth>$(window).width()){
                console.log("parentSize.left+parentWidth",parentWidth,this[0].offsetLeft)
                console.log("$(window).width()",$(window).width())
                parentWidth = parentWidth - (this[0].offsetLeft+parentWidth-$(window).width())
            }
            sliderParent2d.css({
                'height': height2d+'px',
                'overflow':'hidden',
                display:'none'
            });

            sliderParent.css({
                'width': parentWidth+"px",
                'height': (parentHeight)+"px",
                'overflow':'hidden',
                display:'none'
            });
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
            if($(window).width()<991){
                sliderParent.css("display","none");
                sliderParent2d.css("display","block");
                timerId2d = startSlider2d();
                $(plugin).addClass(" d-flex").addClass("justify-content-center")
            }else{
                sliderParent2d.css("display","none");
                sliderParent.css("display","block");
                timerId = startSlider3d();
                $(plugin).removeClass(" d-flex").removeClass("justify-content-center")
            }
            $(window).resize(function (){
                if($(this).width()<991){
                    clearInterval(timerId);
                    clearInterval(timerId2d);
                    sliderParent.css("display","none");
                    sliderParent2d.css("display","block");
                    timerId2d = startSlider2d();
                    $(sParent).addClass(" d-flex").addClass("justify-content-center")
                }else{
                    clearInterval(timerId);
                    clearInterval(timerId2d);
                    sliderParent2d.css("display","none");
                    sliderParent.css("display","block");
                    timerId = startSlider3d();
                    $(sParent).removeClass(" d-flex").removeClass("justify-content-center")
                }
            })
            function startSlider3d(){
                return setInterval(function () {
                    const fc = $(`ul.slider-3d > li.slider-item:nth-child(1)`);
                    const lc = $(`ul.slider-3d > li.slider-item:nth-child(${settings.data.length})`);
                    let [tx, ty, tz, top, zIndex] = getXYZTZ(fc)
                    let [x, y, z, t, zi] = getXYZTZ(lc)
                    const fcChild = fc.clone(true).css({
                        'top': `${t}`,
                        'transform': `translateX(${lastTranslateX+lc[0].getBoundingClientRect().width}px) translateY(${lastTranslateY}px) perspective(${perspective}px) translateZ(${z}px)`,
                        'z-index': -1,
                        'opacity':0,
                    });
                    const lcChild = lc.clone(true).css({
                        'top': `${top}`,
                        'transform': `translateX(${firstTranslateX+fc[0].getBoundingClientRect().width}px) translateY(${firstTranslateY}px) perspective(${perspective}px) translateZ(${tz}px)`,
                        'z-index': 0,
                        'opacity':0,
                        'transition': 'all 0s'
                    });

                    fc.before(lcChild)
                    // fc.before()
                    $(`ul.slider-3d > li.slider-item`).removeClass('active-slider');
                    // currentItemIndex = currentItemIndex+1>=settings.data.length?0:currentItemIndex+1;
                    console.log("current :", currentItemIndex);
                    $(`ul.slider-3d > li.slider-item:nth-child(n+2)`).each(function (i) {
                        if(i===settings.data.length - 1){
                            // let [tx, ty, tz, top, zIndex] = getXYZTZ(fc)
                            lcChild.css({
                                'transform': `translateX(${firstTranslateX}px) translateY(${firstTranslateY}px) perspective(${perspective}px) translateZ(${-(activeItemIndex - 1) * dz}px)`,
                                'opacity':1,
                                'transition': 'all .5s'
                            })
                            $(this).css({
                                'top': $(this).css('top'),
                                'transform': `translateX(${lastTranslateX+$(this)[0].getBoundingClientRect().width}px) translateY(${lastTranslateY}px) perspective(${perspective}px) translateZ(${(activeItemIndex - 1) * dz - (i) * dz}px)`,
                                'z-index':-i,
                                'opacity': 0,
                                'transition': 'all .5s'
                            }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
                                $(this).remove();
                                currentItemIndex = currentItemIndex-1<0?settings.data.length-1:currentItemIndex-1;
                                settings.onItemActive.call(plugin,settings.data[currentItemIndex])
                            });
                        } else {
                            const x = (activeItemIndex - 1) * dx - (i+1) * dx;
                            const y = -(i+1) * dy;
                            const z = (activeItemIndex - 1) * dz - (i+1) * dz;
                            $(this).css({
                                'top': `${(i + 1) * $(this).outerHeight()}px`,
                                'transform': `translateX(${x < 0 ? x * -1 : x}px) translateY(${y}px) perspective(${perspective}px) translateZ(${z > 0 ? z * -1 : z}px)`,
                                'z-index': x < 0 ? -i : 1,
                                'opacity': 1,
                                'transition': 'all .5s'
                            }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {

                            })
                        }

                    });
                    $(`ul.slider-3d > li.slider-item:eq(${activeItemIndex-1})`).addClass('active-slider');

                }, 3000)
            }
            function startSlider2d(){
                return setInterval(function () {
                    const fc = $(`ul.slider-2d > li.slider-item:nth-child(1)`);
                    const lc = $(`ul.slider-2d > li.slider-item:nth-child(${settings.data.length})`);
                    const fx = -(activeItemIndex-1)*width2d;
                    const lx = -(activeItemIndex-settings.data.length)*width2d+(settings.data.length-1)*20;
                    const fcChild = fc.clone(true).css({
                        'top': 0,
                        'opacity':0,
                        left:lx+'px'
                    });
                    const lcChild = lc.clone(true).css({
                        'top': `0`,'z-index': 0,
                        'opacity':0,
                        left:fx+'px'
                    });

                    fc.before(lcChild)
                    // fc.before()
                    $(`ul.slider-2d > li.slider-item`).removeClass('active-slider');
                    // currentItemIndex = currentItemIndex-1<0?settings.data.length-1:currentItemIndex-1;
                    $(`ul.slider-2d > li.slider-item:nth-child(n+2)`).each(function (i) {
                        if(i===settings.data.length - 1){
                            // let [tx, ty, tz, top, zIndex] = getXYZTZ(fc)
                            lcChild.css({
                                left:fx+'px',
                                'opacity':1,
                                'transition': 'all .5s'
                            })
                            $(this).remove();
                            currentItemIndex2d = currentItemIndex2d-1<0?settings.data.length-1:currentItemIndex2d-1;
                            settings.onItemActive.call(plugin,settings.data[currentItemIndex2d])
                        } else {
                            const a = activeItemIndex-1-(i+1);
                            const x = -a * width2d +(i+1)*20;
                            $(this).css({
                                'top': 0,
                                left:x+"px",
                                'opacity': 1,
                                'transition': 'all .5s'
                            }).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {

                            })
                        }

                    });
                    $(`ul.slider-2d > li.slider-item:eq(${activeItemIndex-1})`).addClass('active-slider');

                }, 3000)
            }
        }
        function getXYZTZ(jElem) {
            // console.log(jElem.css('transform'))
            const t = jElem.css('transform')?.split(",")||[];
            const [x, y, z, top, zIndex] = [t[12], t[13], t[14], jElem.css("top"), jElem.css("z-index")];
            return [x, y, z, top, zIndex];
        }
    }
}(jQuery))
