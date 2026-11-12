import html from './index.html';

export default {
  fetch(request) {
    return new Response(request.method === 'HEAD' ? null : html, {
      headers: { 'content-type': 'text/html; charset=UTF-8' },
    });
  },
};
