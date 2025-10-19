import React, { useEffect, useState } from "react";
import { EventType } from "../types/eventType";

interface EventFormProps {
  eventData: EventType;
  possibleEvents: string[];
  possibleFeatures: string[];
  selectedFeatures: string[];
  getFeatures: (eventData: EventType) => Promise<void>;
  lockInEvent: (eventData: EventType) => void;
  updateEvent: (eventData: EventType) => void;
  updateSelectedFeatures: (features: string[]) => void;
}

function EventForm({
  eventData,
  possibleEvents,
  possibleFeatures,
  selectedFeatures,
  lockInEvent,
  getFeatures,
  updateEvent,
  updateSelectedFeatures,
}: EventFormProps) {
  // Local state for date components
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState<boolean>(false);
  let calledServer = false;

  // Generate array of years (current year to 5 years ahead)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  // Check if all form fields are filled
  const isFormComplete = () => {
    return (
      eventData.eventType !== "" &&
      eventData.date.toString() !== new Date().toString() &&
      eventData.location !== "" &&
      eventData.price !== "" &&
      eventData.attendees !== ""
    );
  };

  const callServer = () => {
    if (
      !calledServer &&
      eventData.eventType !== "" &&
      eventData.date.toString() !== new Date().toString() &&
      eventData.location !== "" &&
      eventData.price !== "" &&
      eventData.attendees !== ""
    ) {
      // get the features based on the filled in info
      // alert(`calling with` + eventData);
      getFeatures(eventData);
      calledServer = true;
    }
  };

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!calledServer && isFormComplete()) {
        setIsLoadingFeatures(true);
        try {
          await getFeatures(eventData);
          calledServer = true;
        } catch (error) {
          console.error("Error fetching features:", error);
        } finally {
          setIsLoadingFeatures(false);
        }
      }
    };

    fetchFeatures();
  }, [eventData]);

  // Handle date changes and update parent component
  const handleDateChange = (
    newMonth: string,
    newDay: string,
    newYear: string
  ) => {
    setMonth(newMonth);
    setDay(newDay);
    setYear(newYear);

    // If all three values are selected, create a Date object and update eventData
    if (newMonth && newDay && newYear) {
      const monthIndex = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].indexOf(newMonth);

      const date = new Date(parseInt(newYear), monthIndex, parseInt(newDay));
      updateEvent({ ...eventData, date });
    }
  };

  // Handle price range change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange(value);
    updateEvent({ ...eventData, price: `0 - ${value.toString()}` });
  };

  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 500) {
      return `${(price / 500).toFixed(0)}k`;
    }
    return `${price}`;
  };

  return (
    <div
      style={{
        width: "100vw",
        backgroundColor: "#FFFFFF",
        marginLeft: -8,
        marginRight: -8,
        paddingLeft: 8,
        paddingRight: 8,
      }}
    >
      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #4B3831;
            cursor: pointer;
            border: 3px solid #FFFFFF;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #4B3831;
            cursor: pointer;
            border: 3px solid #FFFFFF;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1.2);
              opacity: 1;
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
        `}
      </style>
      {/* Pink horizontal box at the top of the form */}
      <div
        style={{
          backgroundColor: "#EFD7D5",
          height: "33px",
          width: "100vw",
          margin: 0,
          marginLeft: -8,
          marginRight: -8,
          marginTop: -8,
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        aria-hidden="true"
      />

      {/* White box with centered grey circle */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          height: "138px",
          width: "100%",
          position: "relative",
        }}
      >
        {/* <div
          style={{
            backgroundColor: "#D9D9D9",
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            position: "absolute",
            left: "40px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
          aria-hidden="true"
        /> */}
        <img src={"https://i.pinimg.com/736x/39/3d/97/393d97e8792a0538413b7246c0e514b0.jpg"}
        style={{
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            position: "absolute",
            left: "40px",
            top: "50%",
            transform: "translateY(-50%)"}}/>
        <div
          style={{
            position: "absolute",
            left: "183px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "16px",
          }}
        >
          <h1 className="event-form-text">Coordin-AI-te</h1>
        </div>
      </div>

      {/* Event form top photo */}
      <div style={{ width: "100vw", marginLeft: "-8px" }}>
        <img
          src="https://plus.unsplash.com/premium_photo-1674235766088-80d8410f9523?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VkZGluZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=700"
          alt="Event background"
          style={{
            width: "100vw",
            height: "300px",
            objectFit: "cover",
            objectPosition: "50% 40%",
            display: "block",
            transform: "scale(1)",
            position: "relative",
          }}
        />
      </div>

      {/* Event Type Selection */}
      <div
        style={{
          marginTop: "75px",
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "normal",
          position: "relative",
          // paddingLeft: "275px",
        }}
      >
        <h1 className="event-form-question-text">
          What event are we planning today?
        </h1>
      </div>
      <div
        style={{
          textAlign: "left",
          paddingLeft: "450px",
            marginTop: "20px",
            alignSelf: "center",
            justifyContent: "center",
            alignContent:"center",
        }}
      >
        <select
          style={{
            width: "800px",
            color: "white",
            backgroundColor: "#4B3831",
            padding: "10px",
            fontSize: "18px",
            borderRadius: "100px",
            alignSelf: "center"
          }}
          value={eventData.eventType || ""}
          onChange={(e) =>
            updateEvent({ ...eventData, eventType: e.target.value })
          }
        >
          <option value="">Select an event...</option>
          {possibleEvents.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {/* Left Image & Date Selection */}
      <div
        style={{
          display: "flex",
          width: "100vw",
          paddingTop: "150px",
          marginLeft: "-8px",
          gap: "100px",
          alignItems: "flex-start",
        }}
      >
        {/* Wrapped image in its own div */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="https://img.freepik.com/premium-photo/elegant-wedding-background-design_1287624-42710.jpg"
            alt="Wedding background"
            style={{
              width: "400px",
              height: "750px",
              objectFit: "cover",
              objectPosition: "100% 40%",
              display: "block",
            }}
          />
        </div>

        {/* Added wrapper div for date section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "100px",
            flex: 1,
          }}
        >
          {/* Date Question Text */}
          <div
            style={{
              textAlign: "center",
              fontSize: "40px",
              fontWeight: "300",
              marginRight: "100px",
            }}
          >
            <h1
              className="event-form-question-text"
              style={{ margin: 0, fontWeight: "300" }}
            >
              When will the event take place?
            </h1>
          </div>

          {/* Date Dropdowns Container */}
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Month Dropdown */}
            <select
              style={{
                width: "200px",
                color: "black",
                backgroundColor: "#D29C9A",
                padding: "10px",
                fontSize: "18px",
                borderRadius: "100px",
                borderWidth: "0px",
                cursor: "pointer",
                marginRight: "100px",
              }}
              value={month}
              onChange={(e) => handleDateChange(e.target.value, day, year)}
            >
              <option value="">Month...</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>

            {/* Day Dropdown */}
            <select
              style={{
                width: "150px",
                color: "black",
                backgroundColor: "#D29C9A",
                padding: "10px",
                fontSize: "18px",
                borderRadius: "100px",
                borderWidth: "0px",
                cursor: "pointer",
                marginRight: "100px",
              }}
              value={day}
              onChange={(e) => handleDateChange(month, e.target.value, year)}
            >
              <option value="">Day...</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              style={{
                width: "150px",
                color: "black",
                backgroundColor: "#D29C9A",
                padding: "10px",
                fontSize: "18px",
                borderRadius: "100px",
                borderWidth: "0px",
                cursor: "pointer",
                marginRight: "100px",
              }}
              value={year}
              onChange={(e) => handleDateChange(month, day, e.target.value)}
            >
              <option value="">Year...</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Section */}
          <div style={{ marginTop: "80px" }}>
            <div
              style={{
                textAlign: "center",
                fontSize: "40px",
                fontWeight: "300",
                marginRight: "100px",
              }}
            >
              <h1
                className="event-form-question-text"
                style={{ margin: 0, fontWeight: "300" }}
              >
                What is our price range?
              </h1>
            </div>

            <div
              style={{
                marginTop: "40px",
                padding: "40px 60px",
                backgroundColor: "#C2C2B6",
                borderRadius: "10px",
                marginRight: "100px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                <span>$0</span>
                <span style={{ fontSize: "20px", fontWeight: "600" }}>
                  {formatPrice(priceRange)}
                </span>
                <span>$200,000+</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={priceRange}
                onChange={handlePriceChange}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "5px",
                  outline: "none",
                  background: `linear-gradient(to right, #D29C9A 0%, #D29C9A ${
                    (priceRange / 5000) * 5
                  }%, #D9D9D9 ${(priceRange / 5000) * 5}%, #D9D9D9 100%)`,
                  WebkitAppearance: "none",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          {/* Location Section */}
          <div style={{ marginTop: "80px" }}>
            <div
              style={{
                textAlign: "center",
                fontSize: "40px",
                fontWeight: "300",
                marginRight: "100px",
              }}
            >
              <h1
                className="event-form-question-text"
                style={{ margin: 0, fontWeight: "300" }}
              >
                Where will the event take place?
              </h1>
            </div>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <select
                style={{
                  width: "600px",
                  color: "white",
                  backgroundColor: "#4B3831",
                  padding: "15px 25px",
                  fontSize: "18px",
                  borderRadius: "100px",
                  cursor: "pointer",
                  border: "none",
                  marginRight: "100px",
                }}
                value={eventData.location || ""}
                onChange={(e) =>
                  updateEvent({ ...eventData, location: e.target.value })
                }
              >
                <option value="">Please select one</option>
                <option value="Seattle, WA">Seattle, WA</option>
                <option value="Portland, OR">Portland, OR</option>
                <option value="San Francisco, CA">San Francisco, CA</option>
                <option value="Los Angeles, CA">Los Angeles, CA</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Chicago, IL">Chicago, IL</option>
                <option value="Austin, TX">Austin, TX</option>
                <option value="Denver, CO">Denver, CO</option>
                <option value="Boston, MA">Boston, MA</option>
                <option value="Miami, FL">Miami, FL</option>
              </select>
            </div>
          </div>

          {/* Attendance Section */}
          <div style={{ marginTop: "80px" }}>
            <div
              style={{
                textAlign: "center",
                fontSize: "40px",
                fontWeight: "300",
                marginRight: "100px",
              }}
            >
              <h1
                className="event-form-question-text"
                style={{ margin: 0, fontWeight: "300" }}
              >
                How many guests are attending?
              </h1>
            </div>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <select
                style={{
                  width: "600px",
                  color: "white",
                  backgroundColor: "#4B3831",
                  padding: "15px 25px",
                  fontSize: "18px",
                  borderRadius: "100px",
                  cursor: "pointer",
                  border: "none",
                  marginRight: "100px",
                }}
                value={eventData.attendees || ""}
                onChange={(e) =>
                  updateEvent({ ...eventData, attendees: e.target.value })
                }
              >
                <option value="">Please select one</option>
                <option value="1-10">1-10 guests</option>
                <option value="11-20">11-20 guests</option>
                <option value="21-30">21-30 guests</option>
                <option value="31-40">31-40 guests</option>
                <option value="41-50">41-50 guests</option>
                <option value="51+">51+ guests</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Selection Section */}
      <div
        style={{
          marginTop: "150px",
          textAlign: "center",
          paddingBottom: "100px",
        }}
      >
        <h2
          style={{
            fontSize: "40px",
            fontWeight: "300",
            marginBottom: "40px",
            fontFamily: "KyivType, serif",
          }}
        >
          Which features would you like at your event?
        </h2>

        {isLoadingFeatures ? (
          // LOADING STATE
          <div
            style={{
              padding: "80px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                marginBottom: "30px",
              }}
            >
              {/* Outer spinning circle */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  border: "4px solid #EFD7D5",
                  borderTop: "4px solid #D29C9A",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              {/* Inner bouncing dots */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#D29C9A",
                    animation: "bounce 1.4s infinite ease-in-out",
                    animationDelay: "-0.32s",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#D29C9A",
                    animation: "bounce 1.4s infinite ease-in-out",
                    animationDelay: "-0.16s",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#D29C9A",
                    animation: "bounce 1.4s infinite ease-in-out",
                  }}
                />
              </div>
            </div>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "400",
                color: "#4B3831",
                marginBottom: "15px",
              }}
            >
              Generating personalized features...
            </h3>
            <p
              style={{
                fontSize: "18px",
                color: "#B8A5A3",
                maxWidth: "500px",
                lineHeight: "1.6",
              }}
            >
              Our AI is analyzing your event details to recommend the perfect features for your occasion
            </p>
            {/* Shimmer effect bar */}
            <div
              style={{
                marginTop: "40px",
                width: "400px",
                height: "4px",
                backgroundColor: "#EFD7D5",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, #D29C9A, transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
          </div>
        ) : possibleFeatures.length > 0 || selectedFeatures.length > 0 ? (
          // LOADED STATE WITH FEATURES
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 200px)",
                gap: "20px",
                justifyContent: "center",
                marginBottom: "60px",
              }}
            >
              {possibleFeatures.map((feature, index) => {
                const isSelected = selectedFeatures.includes(feature);

                return (
                  <div
                    key={`feature-${index}`}
                    onClick={() => {
                      if (isSelected) {
                        updateSelectedFeatures(
                          selectedFeatures.filter((f) => f !== feature)
                        );
                      } else {
                        updateSelectedFeatures([...selectedFeatures, feature]);
                      }
                    }}
                    style={{
                      backgroundColor: isSelected ? "#D29C9A" : "#EFD7D5",
                      borderRadius: "50px",
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "60px",
                      position: "relative",
                      cursor: "pointer",
                      border: isSelected
                        ? "2px solid #4B3831"
                        : "2px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "#D29C9A";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "transparent";
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: isSelected ? "600" : "500",
                        color: isSelected ? "white" : "black",
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Force Get Features Button */}
            <div
              style={{
                marginTop: "40px",
                // display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection:"column"
              }}
            >
              <button
                onClick={() => callServer()}
                style={{
                  backgroundColor: "#EFD7D5",
                  color: "#4B3831",
                  border: "2px solid #D29C9A",
                  borderRadius: "50px",
                  padding: "12px 40px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  marginRight: "100px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#D29C9A";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#EFD7D5";
                  e.currentTarget.style.color = "#4B3831";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Refresh Feature Recommendations
              </button>
            
            {/* Submit Button - Show only when features are available */}
            <button
              onClick={() => lockInEvent(eventData)}
              style={{
                backgroundColor: "#D29C9A",
                color: "white",
                border: "none",
                borderRadius: "50px",
                padding: "15px 60px",
                fontSize: "18px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginBottom: "80px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#C08B89";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#D29C9A";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Submit
            </button>
            </div>
          </>
        ) : (
          // EMPTY STATE - Form not complete
          <div
            style={{
              fontSize: "24px",
              color: "#B8A5A3",
              fontStyle: "italic",
              padding: "60px 20px",
              marginBottom: "80px",
            }}
          >
            Finish filling out the form to see AI generated event features!
          </div>
        )}
      </div>
    </div>
  );
}

export default EventForm;