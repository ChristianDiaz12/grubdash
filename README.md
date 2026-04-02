# grubdash

1. Did you use AI tools? Describe how. 

Yes, I did use AI. I used AI to help me debug my code after running tests. For example, in my dishes controller, I accidentally named two functions "list". This led to errors that I could not figure out how to fix, so I turned to AI to help analyze my code and tell me my problem. 

2. Justification of design decision 

My API was designed using clear seperation of jobs. This was done by organizing logic into the controllers, routers, middleware, and utility files, which helps the maintainability and readability of my code. My controllers are responbile for the business logic and data manipulation while my routers strictly handle route defintions. I also created reusable middleware for validations, existence checks, and rule enforcement. This structure follows RESTful design principles. 

3. Explanation of debugging

My debugging approach was test driven and systematic. I utilized the tests written for me and analyzed failing test outputs in order to identify precise mismatches between the expected and actual behavior. I traced errors backwards from test assertions to router handlers and middleware chains. When issues arose, I attempted to isolate each problem by reviewing function definitions and exports until root causes were identified. If I was not able to identify the root cause myself, I turned to AI to help interpret the problem and find the source. 

4. Description of how my solution handles errors and edge cases

I used centralized middleware to handle errors and edge cases. This middleware returned the appropriate HTTP status codes and descriptive messages for invalid inputs, missing resources, or unsupported methods. Edge cases such as missing required fields, empty arrays, etc. are handled in my code by using validation middleware before even reaching the controller logic. 

5. Process Log Outlining Key Milestones

The development process began with setting up the project structure (I brainstorm this on a piece of paper) and reviewing the provided data files and tests in order to understand the expectations of this assignment. Initial milestones included implementing core CRUD handles for dishes and orders, followed by adding layered validation middleware. After that, I pivoted towards mainly resolving test failures, refining edge case handling, and trying to figure out what business rules were necessary (i.e. deletion contraints). 

6. Evidence of individual and original contributions

This project reflects my individual contributions through my deliberate design decisions, iterative problem solving, and test driven refinements. I made intentional trade offs by prioritizing clarity and correctness over brevity. For example, seperating concerns such as orderExists, dishesIsValid, and statusIsPending helped improve my code's readability and made debugging a lot easier. If given more time, I would enhance the project by reducing validation duplication through shared utilities and adding more documentation comments directly to the middleware chains as this would help improve the code's maintainability. 

7. Authenticity explanation

The authenticity of this work is demonstrated through my clear alignment between design intent, implementation, and the development process. For example, the implementation of GET /orders directly reflects RESTful design principles that I have learned during this course so far. The route delegates responsibily to a dedicated controller method that retrieves data from the in memory store and returns it in a consistent format. While I was not initially aware that maintaining a formal process log was an expectation for this project, I can identify several meaningful points in my development process. One of these would be establishing the core CRUD functionality for dishes and orders. Other milestones would be implementing the latered validation middleware and resolving complex issues such as ID mismatch handling. Addressing these challenges required a close analysis of test failures, thorough inspection of my code's logic, and a solid understanding of how express middleware and javascript interact. This iterative refinement, even without a written log, reflects my deliberate, intentional development approach and demonstrates that my final solution is a result of active reasoning, debugging, and learning. 
