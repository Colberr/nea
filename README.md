# NEA Vectors
## Drawing lines and planes
**r** = A general point on the line or plane
### Line
**r** = **a**+&lambda;**b**, where **a** is a known point on the line and **b** is the directional vector.
### Plane
**r**.**n** = **a**.**n**, where **a** is a known point on the plane and **n** is the direction of the normal to the plane.

*Other formats: **r**=**a**+&lambda;**b**+&mu;**c**; **r**.**n**=d*
### Point
**P** = (x,y,z), a position vector (i.e.: coordinates).
## Other Features
### Import/ Export
You can import lines, planes and points by opening the import/ export window and pasting them into the import box (e.g.: `[{"id":"l000","format":"lineAB","values":[-3,-1,-3,2,1,2]},{"id":"p000","format":"planeAN","values":[3,1,1,-3,1,2]},{"id":"x000","format":"pointCol","values":[-1,1,1]}]`). 

You can also export equations you have made by copying them and saving them somewhere. 
### Camera movement
Left-click to rotate the camera. Right-click to move the camera. Press `Recentre camera` to reset it.
### Calculation operations (Not finished)
You can perform calculations on the lines, planes and points (e.g. whether two lines meet). This feature is not completed, therefore, doesn't fully work. 