"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Course = require("./course.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newCourse = {
    handle: "new-course",
    name: "New Course Country Club",
    rating: 71.2,
    slope: 122,
    pars: {
      hole1: 4,
      hole2: 3,
      hole3: 4,
      hole4: 3,
      hole5: 4,
      hole6: 3,
      hole7: 4,
      hole8: 3,
      hole9: 4,
      hole10: 3,
      hole11: 4,
      hole12: 3,
      hole13: 4,
      hole14: 3,
      hole15: 4,
      hole16: 3,
      hole17: 4,
      hole18: 3,
    },
    handicaps: {
      hole1: 1,
      hole2: 2,
      hole3: 3,
      hole4: 4,
      hole5: 5,
      hole6: 6,
      hole7: 7,
      hole8: 8,
      hole9: 9,
      hole10: 10,
      hole11: 11,
      hole12: 12,
      hole13: 13,
      hole14: 14,
      hole15: 15,
      hole16: 16,
      hole17: 17,
      hole18: 18,
    },
  };

  test("works", async function () {
    let course = await Course.create(newCourse);
    // Why is rating changed from decimal to string in the database?
    expect(course).toEqual({ ...newCourse, rating: "71.2" });

    // Check that the course was inserted into the test database
    const courseResult = await db.query(
      `SELECT *
           FROM courses
           WHERE handle = 'new-course'`
    );
    const parsResult = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
            FROM pars
            WHERE course_handle = 'new-course'`
    );
    const handicapResult = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
            FROM handicaps
            WHERE course_handle = 'new-course'`
    );
    const testCourse = courseResult.rows[0];
    const pars = parsResult.rows[0];
    const handicaps = handicapResult.rows[0];
    testCourse.pars = pars;
    testCourse.handicaps = handicaps;

    expect(testCourse).toEqual({ ...newCourse, rating: "71.2" });
  });

  test("bad request with dupe", async function () {
    try {
      await Course.create(newCourse);
      await Course.create(newCourse);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all", async function () {
    let courses = await Course.findAll();

    expect(courses).toEqual([
      {
        handle: "pebble-beach",
        name: "Pebble Beach Golf Course",
        rating: "88.8",
        slope: 123,
        pars: {
          hole1: 5,
          hole2: 5,
          hole3: 5,
          hole4: 5,
          hole5: 5,
          hole6: 5,
          hole7: 5,
          hole8: 5,
          hole9: 5,
          hole10: 5,
          hole11: 5,
          hole12: 5,
          hole13: 5,
          hole14: 5,
          hole15: 5,
          hole16: 5,
          hole17: 5,
          hole18: 5,
        },
        handicaps: {
          hole1: 18,
          hole2: 17,
          hole3: 16,
          hole4: 15,
          hole5: 14,
          hole6: 13,
          hole7: 12,
          hole8: 11,
          hole9: 10,
          hole10: 9,
          hole11: 8,
          hole12: 7,
          hole13: 6,
          hole14: 5,
          hole15: 4,
          hole16: 3,
          hole17: 2,
          hole18: 1,
        },
      },
      {
        handle: "roddy-ranch",
        name: "Roddy Ranch Golf Course",
        rating: "77.7",
        slope: 111,
        pars: {
          hole1: 4,
          hole2: 4,
          hole3: 4,
          hole4: 4,
          hole5: 4,
          hole6: 4,
          hole7: 4,
          hole8: 4,
          hole9: 4,
          hole10: 4,
          hole11: 4,
          hole12: 4,
          hole13: 4,
          hole14: 4,
          hole15: 4,
          hole16: 4,
          hole17: 4,
          hole18: 4,
        },
        handicaps: {
          hole1: 1,
          hole2: 2,
          hole3: 3,
          hole4: 4,
          hole5: 5,
          hole6: 6,
          hole7: 7,
          hole8: 8,
          hole9: 9,
          hole10: 10,
          hole11: 11,
          hole12: 12,
          hole13: 13,
          hole14: 14,
          hole15: 15,
          hole16: 16,
          hole17: 17,
          hole18: 18,
        },
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let course = await Course.get("roddy-ranch");
    expect(course).toEqual({
      handle: "roddy-ranch",
      name: "Roddy Ranch Golf Course",
      rating: "77.7",
      slope: 111,
      pars: {
        hole1: 4,
        hole2: 4,
        hole3: 4,
        hole4: 4,
        hole5: 4,
        hole6: 4,
        hole7: 4,
        hole8: 4,
        hole9: 4,
        hole10: 4,
        hole11: 4,
        hole12: 4,
        hole13: 4,
        hole14: 4,
        hole15: 4,
        hole16: 4,
        hole17: 4,
        hole18: 4,
      },
      handicaps: {
        hole1: 1,
        hole2: 2,
        hole3: 3,
        hole4: 4,
        hole5: 5,
        hole6: 6,
        hole7: 7,
        hole8: 8,
        hole9: 9,
        hole10: 10,
        hole11: 11,
        hole12: 12,
        hole13: 13,
        hole14: 14,
        hole15: 15,
        hole16: 16,
        hole17: 17,
        hole18: 18,
      },
    });
  });

  test("not found if no such company", async function () {
    try {
      await Course.get("not-a-course");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "Updated Name",
    rating: 99.9,
    slope: 123,
  };

  test("works", async function () {
    let course = await Course.update("roddy-ranch", updateData);
    expect(course).toEqual({
      handle: "roddy-ranch",
      ...updateData,
      rating: "99.9",
    });

    //check database for updated course
    const result = await db.query(
      `SELECT handle, name, rating, slope
           FROM courses
           WHERE handle = 'roddy-ranch'`
    );
    expect(result.rows).toEqual([
      {
        handle: "roddy-ranch",
        name: "Updated Name",
        rating: "99.9",
        slope: 123,
      },
    ]);
  });

  test("not found if no such company", async function () {
    try {
      await Course.update("not-a-course", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Course.update("roddy-ranch", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** updatePars */

describe("updatePars", function () {
  const updateData = {
    hole3: 3,
    hole7: 3,
    hole18: 5,
  };

  test("works", async function () {
    let pars = await Course.updatePars("roddy-ranch", updateData);
    expect(pars).toEqual({
      course_handle: "roddy-ranch",
      hole1: 4,
      hole2: 4,
      hole3: 3,
      hole4: 4,
      hole5: 4,
      hole6: 4,
      hole7: 3,
      hole8: 4,
      hole9: 4,
      hole10: 4,
      hole11: 4,
      hole12: 4,
      hole13: 4,
      hole14: 4,
      hole15: 4,
      hole16: 4,
      hole17: 4,
      hole18: 5,
    });

    //check database for updated pars
    const result = await db.query(
      `SELECT *
           FROM pars
           WHERE course_handle = 'roddy-ranch'`
    );
    expect(result.rows).toEqual([
      {
        course_handle: "roddy-ranch",
        hole1: 4,
        hole2: 4,
        hole3: 3,
        hole4: 4,
        hole5: 4,
        hole6: 4,
        hole7: 3,
        hole8: 4,
        hole9: 4,
        hole10: 4,
        hole11: 4,
        hole12: 4,
        hole13: 4,
        hole14: 4,
        hole15: 4,
        hole16: 4,
        hole17: 4,
        hole18: 5,
      },
    ]);
  });

  test("not found if no such course handle", async function () {
    try {
      await Course.updatePars("not-a-course", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Course.updatePars("roddy-ranch", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** updatePars */

describe("updateHandicaps", function () {
  const updateData = {
    hole1: 3,
    hole2: 4,
    hole3: 1,
    hole4: 2,
  };

  test("works", async function () {
    let handicaps = await Course.updateHandicaps("roddy-ranch", updateData);
    expect(handicaps).toEqual({
      course_handle: "roddy-ranch",
      hole1: 3,
      hole2: 4,
      hole3: 1,
      hole4: 2,
      hole5: 5,
      hole6: 6,
      hole7: 7,
      hole8: 8,
      hole9: 9,
      hole10: 10,
      hole11: 11,
      hole12: 12,
      hole13: 13,
      hole14: 14,
      hole15: 15,
      hole16: 16,
      hole17: 17,
      hole18: 18,
    });

    //check database for updated handicaps
    const result = await db.query(
      `SELECT *
           FROM handicaps
           WHERE course_handle = 'roddy-ranch'`
    );
    expect(result.rows).toEqual([
      {
        course_handle: "roddy-ranch",
        hole1: 3,
        hole2: 4,
        hole3: 1,
        hole4: 2,
        hole5: 5,
        hole6: 6,
        hole7: 7,
        hole8: 8,
        hole9: 9,
        hole10: 10,
        hole11: 11,
        hole12: 12,
        hole13: 13,
        hole14: 14,
        hole15: 15,
        hole16: 16,
        hole17: 17,
        hole18: 18,
      },
    ]);
  });

  test("not found if no such course handle", async function () {
    try {
      await Course.updatePars("not-a-course", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Course.updatePars("roddy-ranch", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Course.remove("roddy-ranch");
    const res = await db.query(
      "SELECT handle FROM courses WHERE handle='roddy-ranch'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Course.remove("not-a-real-course");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
