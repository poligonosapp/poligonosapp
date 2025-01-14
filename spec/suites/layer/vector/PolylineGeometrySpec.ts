describe('PolylineGeometry', function () {
	const map = new L.Map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6});

	after(function () {
		map.remove();
	});

	describe("#distanceTo", function () {
		it("calculates distances to points", function () {
			const p1 = map.latLngToLayerPoint(new L.LatLng(55.8, 37.6));
			const p2 = map.latLngToLayerPoint(new L.LatLng(57.123076977278, 44.861962891635));
			const latlngs = [[56.485503424111, 35.545556640339], [55.972522915346, 36.116845702918], [55.502459116923, 34.930322265253], [55.31534617509, 38.973291015816]]
				.map(function (ll) {
					return new L.LatLng(ll[0], ll[1]);
				});
			const polyline = new L.Polyline([], {
				'noClip': true
			});
			map.addLayer(polyline);

			expect(polyline.closestLayerPoint(p1)).to.be(null);

			polyline.setLatLngs(latlngs);
			const point = polyline.closestLayerPoint(p1);
			expect(point).not.to.be(null);
			expect(point.distance).to.not.be(Infinity);
			expect(point.distance).to.not.be(NaN);

			const point2 = polyline.closestLayerPoint(p2);

			expect(point.distance).to.be.lessThan(point2.distance);
		});
	});
});

describe('LineUtil', function () {
	describe('#isFlat', function () {
		it('should return true for an array of LatLngs', function () {
			expect(L.LineUtil.isFlat([L.latLng([0, 0])])).to.be(true);
		});

		it('should return true for an array of LatLngs arrays', function () {
			expect(L.LineUtil.isFlat([[0, 0]])).to.be(true);
		});

		it('should return true for an empty array', function () {
			expect(L.LineUtil.isFlat([])).to.be(true);
		});

		it('should return false for a nested array of LatLngs', function () {
			expect(L.LineUtil.isFlat([[L.latLng([0, 0])]])).to.be(false);
		});

		it('should return false for a nested empty array', function () {
			expect(L.LineUtil.isFlat([[]])).to.be(false);
		});

		it('should be aliased as _flat for retrocompat', function () {
			expect(L.LineUtil._flat([L.latLng([0, 0])])).to.be(true);
		});

		it('should be aliased as L.Polyline._flat for retrocompat', function () {
			expect(L.Polyline._flat([L.latLng([0, 0])])).to.be(true);
		});
	});
});
