import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse  } from "../../../../../slices/courseSlice"

import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"
import MockTestModal from "./Mock Test Modal"




export default function NestedViewMockTest({ handleChangeEditMockName }) {

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)
  console.log("Course Entire Data",courseEntireData );

  const dispatch = useDispatch()
  console.log(course);

  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [addMockTest, setAddMockTest] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Delele Section
  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({ sectionId, courseId: course._id, token, })
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  // Delete SubSection 
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token })
    if (result) {
      // update the structure of course - As we have got only updated section details 
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  return (
    <>
      <div
        className="rounded-2xl bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {course?.mocktests?.map((section) => (
          // Section Dropdown
          <details key={section._id} open>
            {/* Section Dropdown Content */}
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              {/* sectionName */}
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">
                  {section.mockTestName}
                </p>
              </div>

              <div className="flex items-center gap-x-3">
                {/* Change Edit SectionName button */}
                <button
                  onClick={() =>
                    handleChangeEditMockName(
                      section._id,
                      section.mockTestName
                    )
                  }
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>

                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>

                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className={`text-xl text-richblack-300`} />
              </div>

            </summary>
            <div className="px-6 pb-4">
              {/* Render All Sub Sections Within a Section */}
              {section?.questions?.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.question}
                    </p>
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Mock Test?",
                          text2: "This Mock Test will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}

{/* {course.courseContent ? (
  course.courseContent.flatMap((section) =>
    Array.isArray(section.questions) ? (
      section.questions.map((question, questionIndex) => (
        <div key={`${section._id}-${questionIndex}`}>
          <p className="text-white">
            Q{questionIndex + 1} {question.question}
          </p>
          <p className="text-white">{question.options.option1}</p>
          <p className="text-white">{question.options.option2}</p>
          <p className="text-white">{question.options.option3}</p>
          <p className="text-white">{question.options.option4}</p>
          <p className="text-white mb-10">
            Correct Answer :{question.correctOption}
          </p>
        </div>
      ))
    ) : null
  )
) : null} */}

              {/* <button
                onClick={() => setAddSubsection(section._id)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Lecture</p>
              </button> */}
              <button
                onClick={() => setAddMockTest(section._id)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Mock Test</p>
              </button>
            </div>
          </details>
        ))}
      </div>



      {/* Modal Display */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}

      {addMockTest ? (
        <MockTestModal
          modalData={addMockTest}
          setModalData={setAddMockTest}
          add={true}
        />
      ) : viewSubSection ? (
        <MockTestModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <MockTestModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}



    </>
  )
}