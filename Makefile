run:
	@DEBUG=server node js/index.js

cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha test --print both --recursive

complex:
	./node_modules/.bin/plato -r -d plato js && open plato/index.html

.PHONY: test
