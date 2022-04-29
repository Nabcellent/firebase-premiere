import Toastify from 'toastify-js';

export const toast = (data: ToastDataType) => {
    let duration = (data.duration ?? 7) * 1000,
        type = data.type ?? 'success',
        close = data.close ?? true;

    Toastify({
        text: data.msg,
        duration: duration,
        close: close,
        gravity: data.gravity ?? 'bottom',
        position: data.position ?? 'right',
        className: type,
    }).showToast();
};