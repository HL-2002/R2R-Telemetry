"""
Used to test the generator and grapher functions, as if they were running in the main loop
of the program.

Plots are started and updated in real-time, with the generator function running in a separate thread
to simulate the behavior of a sensor generating data.

The test's elapsed time is added up based on the time it took to generate the data, so that the
plot will be updated accordingly.
"""
