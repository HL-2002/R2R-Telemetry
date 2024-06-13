// Using the exposed API from preload.js
testAPI.test()

// Testing messaging between main and renderer processes
// Renderer to Main


// Usual DOM for testing
document.addEventListener('DOMContentLoaded', () => {
    // Get the test button and p
    const testButton = document.getElementById('testButton')
    const testP = document.getElementById('testP')

    // Add event listener
    testButton.addEventListener('click', async () => {
        // Test read API
        const data = await testAPI.testRead()
        // Display data
        testP.innerHTML = JSON.stringify(data)
    })
})