(function () {
    var s = document.createElement('script'),
        e = !document.body ? document.querySelector('head') : document.body;
    s.src = 'https://acsbapp.com/apps/app/assets/js/acsb.js';
    s.async = s.defer = true;
    s.onload = function () {
        acsbJS.init({
            statementLink: '',
            feedbackLink: '',
            footerHtml: '',
            hideMobile: false,
            hideTrigger: false,
            language: 'en',
            position: 'left',
            leadColor: '#894eff',
            triggerColor: '#894eff',
            triggerRadius: '50%',
            triggerPositionX: 'left',
            triggerPositionY: 'bottom',
            triggerIcon: 'people',
            triggerSize: 'medium',
            triggerOffsetX: 20,
            triggerOffsetY: 20,
            mobile: {
                triggerSize: 'medium',
                triggerPositionX: 'left',
                triggerPositionY: 'bottom',
                triggerOffsetX: 20,
                triggerOffsetY: 20,
                triggerRadius: '50%',
            },
        });
    };
    e.appendChild(s);
})();
