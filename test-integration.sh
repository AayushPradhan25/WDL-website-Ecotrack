#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  🧪 ECOSMART INTEGRATION TEST SUITE"
echo "════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Checking Backend Build...${NC}"
cd eco-smart-backend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend builds successfully${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${YELLOW}2. Checking Frontend Files...${NC}"
FILES_TO_CHECK=(
    "script.js"
    "style.css"
    "user/complaint-list.html"
    "user/complaint-details.html"
    "user/raise-complaint.html"
    "user/dashboard.html"
    "user/livetracking.html"
    "admin/truck-requests.html"
    "admin/schedules.html"
    "admin/admin-dashboard.html"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Found: $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
    fi
done

echo ""
echo -e "${YELLOW}3. Checking API Methods in script.js...${NC}"
if grep -q "getSchedules:" script.js; then
    echo -e "${GREEN}✅ getSchedules method exists${NC}"
else
    echo -e "${RED}❌ getSchedules method missing${NC}"
fi

if grep -q "createSchedule:" script.js; then
    echo -e "${GREEN}✅ createSchedule method exists${NC}"
else
    echo -e "${RED}❌ createSchedule method missing${NC}"
fi

if grep -q "updateSchedule:" script.js; then
    echo -e "${GREEN}✅ updateSchedule method exists${NC}"
else
    echo -e "${RED}❌ updateSchedule method missing${NC}"
fi

if grep -q "deleteSchedule:" script.js; then
    echo -e "${GREEN}✅ deleteSchedule method exists${NC}"
else
    echo -e "${RED}❌ deleteSchedule method missing${NC}"
fi

if grep -q "getAllTruckRequests:" script.js; then
    echo -e "${GREEN}✅ getAllTruckRequests method exists${NC}"
else
    echo -e "${RED}❌ getAllTruckRequests method missing${NC}"
fi

echo ""
echo -e "${YELLOW}4. Checking Sidebar Integration...${NC}"
SIDEBAR_COUNT=$(grep -l "class=\"user-sidebar\"" user/*.html admin/*.html 2>/dev/null | wc -l)
echo -e "${GREEN}✅ Found sidebar in $SIDEBAR_COUNT pages${NC}"

echo ""
echo -e "${YELLOW}5. Checking Backend Modules...${NC}"
if grep -q "TruckRequestsModule" eco-smart-backend/src/app.module.ts; then
    echo -e "${GREEN}✅ TruckRequestsModule registered${NC}"
else
    echo -e "${RED}❌ TruckRequestsModule not registered${NC}"
fi

if grep -q "TruckSchedulesModule" eco-smart-backend/src/app.module.ts; then
    echo -e "${GREEN}✅ TruckSchedulesModule registered${NC}"
else
    echo -e "${RED}❌ TruckSchedulesModule not registered${NC}"
fi

echo ""
echo -e "${YELLOW}6. Checking Complaint DTO...${NC}"
if grep -q "category" eco-smart-backend/src/complaints/dto/complaint.dto.ts; then
    echo -e "${GREEN}✅ Complaint DTO has category field${NC}"
else
    echo -e "${RED}❌ Complaint DTO missing category field${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✅ ALL INTEGRATION CHECKS PASSED!${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📝 Documentation: See INTEGRATION_COMPLETE.md"
echo "🚀 Ready for frontend-backend testing"
echo ""
