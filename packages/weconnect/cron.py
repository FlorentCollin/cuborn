# /// script
# dependencies = [
#   "weconnect-cupra-daern[Images]",
# ]
# ///
import os

from weconnect_cupra import weconnect_cupra
from weconnect_cupra.service import Service


def main():
    print('#  Initialize WeConnect')
    username = os.environ.get('WECONNECT_USERNAME')
    password = os.environ.get('WECONNECT_PASSWORD')
    weConnect = weconnect_cupra.WeConnect(
        username=username,
        password=password,
        updateAfterLogin=False,
        loginOnInit=False,
        service=Service('MyCupra'))

    print('#  Login')
    weConnect.login()
    print('#  update')
    weConnect.update()
    print('#  Report')
    for _, vehicle in weConnect.vehicles.items():
        print(vehicle)

    print('#  done')


if __name__ == '__main__':
    main()

