// src/components/TawkToChat.js
import React, { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/6884ad75bca853191b42735d/1j134b5of';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
  }, []);

  return null;
};

export default TawkToChat;