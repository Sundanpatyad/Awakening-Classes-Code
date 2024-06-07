import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { createMock, createSection, updateMock, updateSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";

import IconBtn from "../../../../common/IconBtn";
import NestedView from "./NestedView";
import NestedViewMockTest from "./NestedViewMockTest";

export default function CourseBuilderForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { register: registerMockTest, handleSubmit: handleSubmitMockTest, formState: { errors: errorsMockTest } } = useForm();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);
  const [editMockName, setEditMockName] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);

    let result;
    try {
      if (editSectionName) {
        result = await updateSection({ sectionName: data.sectionName, sectionId: editSectionName, courseId: course._id }, token);
      } else {
        result = await createSection({ sectionName: data.sectionName, courseId: course._id }, token);
      }

      if (result) {
        dispatch(setCourse(result));
        setEditSectionName(null);
        setValue("sectionName", "");
      }
    } catch (error) {
      toast.error("Error creating/updating section");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    dispatch(setStep(3));
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  const onSubmitMockTest = async (data) => {
    setLoading(true);

    let result;
    try {
      if (editMockName) {
        result = await updateMock({ mockTestName: data.mockTestName, mockId: editMockName, courseId: course._id }, token);
      } else {
        result = await createMock({ mockTestName: data.mockTestName, courseId: course._id }, token);
      }

      if (result) {
        dispatch(setCourse(result));
        setEditMockName(null);
        setValue("mockTestName", "");
      }
    } catch (error) {
      toast.error("Error creating/updating mock test");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditMock = () => {
    setEditMockName(null);
    setValue("mockTestName", "");
  };

  const handleChangeEditMockName = (mockId, mockTestName) => {
    if (editMockName === mockId) {
      cancelEditMock();
      return;
    }
    setEditMockName(mockId);
    setValue("mockTestName", mockTestName);
  };

  const goToNextMock = () => {
    if (course.mocktests.length === 0) {
      toast.error("Please add at least one mock test");
      return;
    }
    dispatch(setStep(3));
  };

  return (
    <div className="space-y-8 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      {/* Section Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        {/* Edit Section Name OR Create Section */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {course.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Mock Test Form */}
      <form onSubmit={handleSubmitMockTest(onSubmitMockTest)} className="space-y-4">
        {/* Mock Test Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="mockTestName">
            Mock Test Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="mockTestName"
            disabled={loading}
            placeholder="Add a Mock Test To Course"
            {...registerMockTest("mockTestName", { required: true })}
            className="form-style w-full"
          />
          {errorsMockTest.mockTestName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Mock Test name is required
            </span>
          )}
        </div>

        {/* Edit Mock Test Name OR Create Mock Test */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editMockName ? "Edit Mock Name" : "Create Mock"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editMockName && (
            <button
              type="button"
              onClick={cancelEditMock}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {course.mocktests?.length > 0 && (
        <NestedViewMockTest handleChangeEditMockName={handleChangeEditMockName} />
      )}

      {/* Next and Back Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onClick={goToNextMock}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
}
