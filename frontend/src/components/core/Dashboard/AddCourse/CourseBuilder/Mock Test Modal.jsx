import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubSection,
  updateMockTest,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";

export default function MockTestModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view || edit) {
      setValue("question", modalData.question);
      setValue("options.option1", modalData.options.option1);
      setValue("options.option2", modalData.options.option2);
      setValue("options.option3", modalData.options.option3);
      setValue("options.option4", modalData.options.option4);
      setValue("correctOption", modalData.correctOption);
    }
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.question !== modalData.question ||
      currentValues.options.option1 !== modalData.option1 ||
      currentValues.options.option2 !== modalData.option2 ||
      currentValues.options.option3 !== modalData.option3 ||
      currentValues.options.option4 !== modalData.option4 ||
      currentValues.correctOption !== modalData.correctOption
    ) {
      return true;
    }
    return false;
  };

  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    formData.append("question", currentValues.question);
    formData.append("options", JSON.stringify(currentValues.options));
    formData.append("correctOption", currentValues.correctOption);
    setLoading(true);
    const result = await updateMockTest(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;
    console.log(data);

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }

    const formData = {
      question: data.question,
      correctOption: data.correctOption,
      options: {
        option1: data.options.option1,
        option2: data.options.option2,
        option3: data.options.option3,
        option4: data.options.option4,
      },
      mockId: modalData,
    };
    console.log("Modal Data" , modalData);
    setLoading(true);
    const result = await updateMockTest(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((mocktests) =>
        mocktests._id === modalData ? result : mocktests
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Mock Test
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="question">
              Question {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="question"
              placeholder="Enter Question"
              {...register("question", { required: true })}
              className="form-style h-[130px] w-full"
            />
            {errors.question && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Question is Required
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="options.option1">
              Option 1{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              type="text"
              disabled={view || loading}
              id="options.option1"
              placeholder="Option 1"
              {...register("options.option1", { required: true })}
              className="form-style resize-x-none w-full"
            />
            {errors.options?.option1 && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Option 1 is Required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="options.option2">
              Option 2{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              type="text"
              disabled={view || loading}
              id="options.option2"
              placeholder="Option 2"
              {...register("options.option2", { required: true })}
              className="form-style resize-x-none w-full"
            />
            {errors.options?.option2 && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Option 2 is Required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="options.option3">
              Option 3{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              type="text"
              disabled={view || loading}
              id="options.option3"
              placeholder="Option 3"
              {...register("options.option3", { required: true })}
              className="form-style resize-x-none w-full"
            />
            {errors.options?.option2 && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Option 3 is Required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="option4">
              Option 4{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
            type="text"
              disabled={view || loading}
              id="options.option4"
              placeholder="Option 4"
              {...register("options.option4", { required: true })}
              className="form-style resize-x-none  w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Option 4 is Required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="correctOption">
            Correct Option{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
            type="text"
              disabled={view || loading}
              id="correctOption"
              placeholder="Correct Option"
              {...register("correctOption", { required: true })}
              className="form-style resize-x-none  w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Correct Option is Required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}