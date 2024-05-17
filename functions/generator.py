import random
import time

""" 
The generator function yields a dictionary of random values within the minimum and maximum 
values given as arguments, effectively generating a random sequence of values within the 
given range.

The dictionary is generated accordingly to the input channels, which contain the name of the
channel, and the minimum and maximum values that the channel can take.

The hz (namely, frequency) parameter determines the waiting time between each call to the 
function, so that it simulates the behavior of a couple of sensors that generate different
channels of data at a certain rate, by using the time.sleep() method.

The idea is to call the function in a separate thread,  so that the main thread can control the
execution of the generator function, effectively simulating a sensor's channel.
"""

""" 
Channel dictionary example:
{
    "channel_name": {
        "min": 0,
        "max": 100,
    }
}
"""

def _generator(channels:dict):
    """ Function to get the random values for the channels given as input.
    """
    data = {}
    for key in channels:
        data[key] = random.randint(channels[key]["min"], channels[key]["max"])
    return data

def generate(channels:dict, hz:int):
    """ Data generation simulation function.
    """
    while True:
        data = _generator(channels)
        print(data)
        time.sleep(1/hz)


# Test the function with some channels
if __name__ == "__main__":
    channels = {
        "speed":{
            "min": 0,
            "max": 300,
        },
        "rpms":{
            "min": 0,
            "max": 8000,
        },
        "temperature":{
            "min": 0,
            "max": 100,
        }
    }

    generate(channels, 10)