// Basic interactivity can be added here
document.addEventListener('DOMContentLoaded', () => {
    console.log("SmartCart loaded successfully!");

    // Example: Add animation class to cards on scroll could go here
    // For now, handling basic cart button test
    const cartButtons = document.querySelectorAll('.btn-primary');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (this.innerText.includes('Add')) {
                // Simple feedback animation
                const originalText = this.innerHTML;
                this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Added';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });
});
