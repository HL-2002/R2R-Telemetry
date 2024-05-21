from tkinter import *
from matplotlib.figure import Figure 
import matplotlib.pyplot as plt 
from grapher import update
import matplotlib.animation as animation
from matplotlib.backends.backend_tkagg import (FigureCanvasTkAgg, 
NavigationToolbar2Tk) 

"""
Used to test the generator and grapher functions, as if they were running in the main loop
of the program.

Plots are started and updated in real-time, with the generator function running in a separate thread
to simulate the behavior of a sensor generating data.

The test's elapsed time is added up based on the time it took to generate the data, so that the
plot will be updated accordingly.
"""

# plot function is created for plotting the graph in tkinter window 
def test_plot():
    # Data
    channels = {
        "speed": {
            "min": 0,
            "max": 300,
        },
        "rpms": {
            "min": 0,
            "max": 8000,
        },
        "temperature": {
            "min": 0,
            "max": 100,
        },
        "pressure": {
            "min": 0,
            "max": 100,
        },
    }
    hz = 100

	# Style
    plt.style.use("ggplot")

    # Creates the fig and line2D artist to initialize plot and animate it later
    # data ini
    interval = (1 / hz) * 1000

    # set axes
    xs = []
    ys = {channel: [] for channel in channels}

    # Fig ini
    fig, ax = plt.subplots(len(channels))

    # Style modification
    for i, channel in enumerate(channels):
        ax[i].title.set_text(channel)

    # Real-time plot
    anim = animation.FuncAnimation(
        fig=fig,
        func=update,
        fargs=(xs, ys, ax, channels, hz),
        interval=interval,
        repeat=False,
    )

    # creating the Tkinter canvas 
    # containing the Matplotlib figure 
    canvas = FigureCanvasTkAgg(fig, master = window) 
    canvas.draw() 

    # placing the canvas on the Tkinter window 
    canvas.get_tk_widget().pack() 

    # creating the Matplotlib toolbar 
    toolbar = NavigationToolbar2Tk(canvas, window) 
    toolbar.update() 

    # placing the toolbar on the Tkinter window 
    canvas.get_tk_widget().pack() 

# the main Tkinter window 
window = Tk() 

# setting the title 
window.title('Plotting in Tkinter') 

# dimensions of the main window 
window.geometry("500x500") 

# button that displays the plot 
plot_button = Button(master = window, 
					command = test_plot, 
					height = 2, 
					width = 10, 
					text = "Plot") 

# place the button 
# in main window 
plot_button.pack() 

# run the gui 
window.mainloop() 

