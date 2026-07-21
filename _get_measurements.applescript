tell application "Safari"
    activate
    set URL of front document to "http://localhost:8080/agriculture.html"
    delay 3
    
    -- Wait for page to fully load
    set pageLoaded to false
    repeat 10 times
        try
            set pageLoaded to (do JavaScript "document.readyState" in front document) is "complete"
            if pageLoaded then exit repeat
        end try
        delay 1
    end repeat
    
    -- Execute JavaScript to get measurements
    set measurements to do JavaScript "
        (function() {
            var r = {};
            
            // 1. document.documentElement height
            r.htmlHeight = document.documentElement.scrollHeight;
            r.htmlClientHeight = document.documentElement.clientHeight;
            
            // 2. document.body height
            r.bodyHeight = document.body.scrollHeight;
            r.bodyClientHeight = document.body.clientHeight;
            
            // 3. main-container height
            var mc = document.querySelector('.main-container');
            r.mainContainerHeight = mc ? mc.scrollHeight : 'NOT FOUND';
            r.mainContainerClientHeight = mc ? mc.clientHeight : 'NOT FOUND';
            
            // 4. Last visible section (contact)
            var lastSection = document.querySelector('#contact');
            r.lastSectionId = lastSection ? lastSection.id : 'NOT FOUND';
            r.lastSectionScrollHeight = lastSection ? lastSection.scrollHeight : 'NOT FOUND';
            r.lastSectionClientHeight = lastSection ? lastSection.clientHeight : 'NOT FOUND';
            
            // 5. offsetTop and offsetHeight of last section
            r.lastSectionOffsetTop = lastSection ? lastSection.offsetTop : 'NOT FOUND';
            r.lastSectionOffsetHeight = lastSection ? lastSection.offsetHeight : 'NOT FOUND';
            
            // 6. Check window.innerHeight vs document.documentElement.clientHeight
            r.windowInnerHeight = window.innerHeight;
            r.docElementClientHeight = document.documentElement.clientHeight;
            r.heightMatch = (window.innerHeight === document.documentElement.clientHeight);
            
            // 7. Check for white/transparent background below last section
            var bodyStyle = window.getComputedStyle(document.body);
            r.bodyBackground = bodyStyle.backgroundColor;
            r.bodyBackgroundImage = bodyStyle.backgroundImage;
            
            var htmlStyle = window.getComputedStyle(document.documentElement);
            r.htmlBackground = htmlStyle.backgroundColor;
            
            // Check elements below the last section in main-container
            var mcEl = mc || document.body;
            var children = Array.from(mcEl.children);
            var lastIdx = children.indexOf(lastSection);
            var elementsBelow = [];
            if (lastIdx >= 0 && lastIdx < children.length - 1) {
                for (var i = lastIdx + 1; i < children.length; i++) {
                    var el = children[i];
                    var style = window.getComputedStyle(el);
                    elementsBelow.push({
                        tag: el.tagName,
                        id: el.id,
                        className: el.className,
                        bgColor: style.backgroundColor,
                        height: el.offsetHeight,
                        visible: style.display !== 'none' && style.visibility !== 'hidden'
                    });
                }
            } else {
                elementsBelow = 'NONE (last section is the last child)';
            }
            r.elementsBelowLastSection = elementsBelow;
            
            // 8. Check .brand-bar visibility and position
            var brandBar = document.querySelector('.brand-bar');
            if (brandBar) {
                var bbStyle = window.getComputedStyle(brandBar);
                r.brandBar = {
                    tag: brandBar.tagName,
                    className: brandBar.className,
                    display: bbStyle.display,
                    position: bbStyle.position,
                    bottom: bbStyle.bottom,
                    left: bbStyle.left,
                    zIndex: bbStyle.zIndex,
                    height: brandBar.offsetHeight,
                    width: brandBar.offsetWidth,
                    opacity: bbStyle.opacity,
                    visibility: bbStyle.visibility,
                    bgColor: bbStyle.backgroundColor,
                    rect: brandBar.getBoundingClientRect()
                };
            } else {
                r.brandBar = 'NOT FOUND';
            }
            
            // Additional: check what's the actual bottom of the page
            r.pageBottom = {
                bodyBottom: document.body.getBoundingClientRect().bottom,
                htmlBottom: document.documentElement.getBoundingClientRect().bottom,
                scrollHeight: document.documentElement.scrollHeight,
                windowHeight: window.innerHeight
            };
            
            return JSON.stringify(r, null, 2);
        })();
    " in front document
    
    -- Write measurements to a file
    set filePath to "/Users/answerose/Documents/Projects/GK-Fullscreen-RWD/_measurements_output.json"
    do shell script "echo '" & measurements & "' > " & quoted form of filePath
    
    return measurements
end tell